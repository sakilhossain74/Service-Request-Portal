
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    getAllStaff,
    createStaff,
    deactivateStaff,
    reactivateStaff
} from '../services/staffService';
import { extractErrorMessage } from '../utils/formatters';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import useReveal from '../hooks/useReveal';

const INITIAL_FORM = {
    name: '',
    email: '',
    department: ''
};

const AdminEmployees = () => {
    const [staffList, setStaffList] = useState([]);
    const [form, setForm] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [busyId, setBusyId] = useState(null);

    const formCardRef = useReveal({ direction: 'up', delay: 60 });
    const activeRef   = useReveal({ direction: 'up', delay: 80 });
    const inactiveRef = useReveal({ direction: 'up', delay: 120 });

    // Fetch all employees, including inactive employees
    const loadStaff = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getAllStaff();
            setStaffList(data || []);
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Failed to load employees'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStaff();
    }, [loadStaff]);

    // Update employee form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Add a new employee
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.department.trim()) {
            toast.warning('Please fill in all fields');
            return;
        }

        setSubmitting(true);

        try {
            await createStaff({
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                department: form.department.trim()
            });

            toast.success('Employee added successfully');
            setForm(INITIAL_FORM);
            await loadStaff();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Failed to add employee'));
        } finally {
            setSubmitting(false);
        }
    };

    // Deactivate an employee without deleting their record
    const handleDeactivate = async (staffId) => {
        const confirmed = window.confirm(
            'Are you sure you want to deactivate this employee?'
        );

        if (!confirmed) return;

        setBusyId(staffId);

        try {
            await deactivateStaff(staffId);
            toast.success('Employee deactivated successfully');
            await loadStaff();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Failed to deactivate employee'));
        } finally {
            setBusyId(null);
        }
    };

    // Reactivate a previously deactivated employee
    const handleReactivate = async (staffId) => {
        setBusyId(staffId);

        try {
            await reactivateStaff(staffId);
            toast.success('Employee reactivated successfully');
            await loadStaff();
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Failed to reactivate employee'));
        } finally {
            setBusyId(null);
        }
    };

    const activeStaff = staffList.filter((staff) => staff.isActive);
    const inactiveStaff = staffList.filter((staff) => !staff.isActive);

    // Reusable employee table
    const renderEmployeeTable = (employees, isActive) => {
        if (employees.length === 0) {
            return (
                <EmptyState
                    title={isActive ? 'No active employees' : 'No inactive employees'}
                    message={
                        isActive
                            ? 'Add a new employee using the form above.'
                            : 'Deactivated employees will appear here.'
                    }
                />
            );
        }

        return (
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Department</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((staff) => (
                            <tr key={staff._id}>
                                <td className="fw-medium">{staff.name}</td>
                                <td>{staff.email}</td>
                                <td>{staff.department}</td>
                                <td>
                                    {isActive ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            disabled={busyId === staff._id}
                                            onClick={() => handleDeactivate(staff._id)}
                                        >
                                            {busyId === staff._id ? 'Processing...' : 'Deactivate'}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-outline-success btn-sm"
                                            disabled={busyId === staff._id}
                                            onClick={() => handleReactivate(staff._id)}
                                        >
                                            {busyId === staff._id ? 'Processing...' : 'Reactivate'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="page-fade-in">
            {/* Page heading */}
            <div className="mb-4">
                <h2 className="page-title">Employee Management</h2>
                <p className="page-subtitle">
                    Add employees and manage active and inactive staff members
                </p>
            </div>

            {/* Add employee form */}
            <div ref={formCardRef} className="card portal-card mb-4">
                <div className="card-body">
                    <h5 className="section-title mb-3">Add New Employee</h5>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="employeeName">
                                    Employee Name
                                </label>
                                <input
                                    id="employeeName"
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter employee name"
                                    value={form.name}
                                    onChange={handleChange}
                                    minLength={2}
                                    maxLength={60}
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label" htmlFor="employeeEmail">
                                    Email Address
                                </label>
                                <input
                                    id="employeeEmail"
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter employee email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label" htmlFor="employeeDepartment">
                                    Department
                                </label>
                                <input
                                    id="employeeDepartment"
                                    type="text"
                                    name="department"
                                    className="form-control"
                                    placeholder="e.g. Maintenance"
                                    value={form.department}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary mt-3"
                            disabled={submitting}
                        >
                            {submitting ? 'Adding...' : 'Add Employee'}
                        </button>
                    </form>
                </div>
            </div>

            {loading ? (
                <Loader message="Loading employees..." />
            ) : (
                <>
                    {/* Active employees */}
                    <div ref={activeRef} className="card portal-card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="section-title mb-0">Active Employees</h5>
                                <span className="badge badge-status-resolved">
                                    {activeStaff.length} Active
                                </span>
                            </div>

                            {renderEmployeeTable(activeStaff, true)}
                        </div>
                    </div>

                    {/* Inactive employees */}
                    <div ref={inactiveRef} className="card portal-card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="section-title mb-0">Inactive Employees</h5>
                                <span className="badge badge-priority-low">
                                    {inactiveStaff.length} Inactive
                                </span>
                            </div>

                            {renderEmployeeTable(inactiveStaff, false)}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminEmployees;
