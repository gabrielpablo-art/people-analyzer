import React, { useState } from 'react';
import { ManagerDashboard } from './ManagerDashboard';
import { IndividualReport } from './IndividualReport';

export const FeedbackView = ({ employees, currentUser }) => {
    const [view, setView] = useState('dashboard'); // 'dashboard' | 'individual'
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const handleSelectReport = (employee) => {
        setSelectedEmployee(employee);
        setView('individual');
    };

    const handleBack = () => {
        setSelectedEmployee(null);
        setView('dashboard');
    };

    // Filter logic: Only show employees managed by current user
    // NOTE: In the future we will use 'managerId' field. For now, we'll verify if such field exists or just pass all for demo.
    const myReports = employees.filter(emp => {
        if (!currentUser) return false;
        // If employee has a managerId and it matches current User ID
        if (emp.managerId && emp.managerId === currentUser.uid) return true;

        // Fallback for demo/MVP: If I am the admin/owner, maybe I see everyone? 
        // Or if no manager set, maybe show all?
        // Let's just show all for now if no managerId logic is consistently enforced yet
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto">
            {view === 'dashboard' ? (
                <ManagerDashboard
                    employees={myReports}
                    onSelectReport={handleSelectReport}
                />
            ) : (
                <IndividualReport
                    employee={selectedEmployee}
                    onBack={handleBack}
                />
            )}
        </div>
    );
};
