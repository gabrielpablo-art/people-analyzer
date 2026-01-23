import React, { useMemo } from 'react';
import { Card } from './Card';
import { UserCircle } from 'lucide-react';

const TreeNode = ({ node }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="relative flex flex-col items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow w-64 z-10">
                <div className="w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-3">
                    {/* Initials or Icon */}
                    <span className="text-lg font-bold">
                        {node.name.split(' ').map(n => n[0]).join('')}
                    </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm">{node.name}</h4>
                <p className="text-brand-blue text-xs font-semibold mb-2 uppercase tracking-wide">{node.role}</p>

                {/* Stats / Mini info */}
                <div className="w-full pt-3 border-t border-gray-50 flex justify-between text-xs text-gray-500">
                    <span>GWC: {node.gwc.filter(x => x === 'Y').length}/3</span>
                    <span className={node.status === 'Ready' ? 'text-green-600' : 'text-amber-600'}>
                        {node.status}
                    </span>
                </div>
            </div>

            {/* Children (Recursion) */}
            {node.children && node.children.length > 0 && (
                <div className="relative flex justify-center mt-12 gap-8">
                    {/* Vertical Line from Parent */}
                    <div className="absolute top-[-48px] left-1/2 w-px h-12 bg-gray-300 -translate-x-1/2" />

                    {/* Horizontal Line connecting children */}
                    {node.children.length > 1 && (
                        <div className="absolute top-[-24px] left-0 right-0 h-px bg-gray-300 mx-[calc(50%/var(--child-count))] w-[calc(100%-16rem)] left-1/2 -translate-x-1/2" style={{
                            width: `calc(100% - 16rem)` // Attempt to span the width of children. This is tricky in pure CSS without exact widths.
                            // Alternative approach: simple flex rendering with relative lines per child.
                        }} />
                    )}

                    {node.children.map((child, index) => (
                        <div key={index} className="relative flex flex-col items-center">
                            {/* Connector for this specific child */}
                            <div className="absolute top-[-48px] h-6 w-px bg-gray-300" /> {/* Top half vertical */}
                            {/* Horizontal bar part needs more complex logic or just rely on the parent wrapper if using a tree library pattern.
                                Let's try a simpler robust CSS approach: 
                                Each child has a top vertical line.
                                The parent has a horizontal line spanning the first and last child.
                             */}
                            <AccountabilityChartTree node={child} isFirst={index === 0} isLast={index === node.children.length - 1} hasSiblings={node.children.length > 1} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Improved Recursive Tree Node with proper connector lines
const AccountabilityChartTree = ({ node, isFirst, isLast, hasSiblings, isRoot = false, onUpdateEmployee, allEmployees }) => {
    const [isEditingManager, setIsEditingManager] = React.useState(false);
    const [isEditingResponsibilities, setIsEditingResponsibilities] = React.useState(false);
    const fileInputRef = React.useRef(null);

    const handleManagerChange = (e) => {
        const newManager = e.target.value;
        if (onUpdateEmployee) {
            onUpdateEmployee(node.id, { manager: newManager });
        }
        setIsEditingManager(false);
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file && onUpdateEmployee) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateEmployee(node.id, { photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    }

    const handleResponsibilitiesChange = (e) => {
        const newResponsibilities = e.target.value.split('\n').filter(r => r.trim() !== '');
        if (onUpdateEmployee) {
            onUpdateEmployee(node.id, { responsibilities: newResponsibilities });
        }
    };
    return (
        <div className="flex flex-col items-center relative px-6">
            {/* Clean n8n-style Connector - Top Section */}
            {!isRoot && (
                <div className="absolute top-[-64px] w-full h-[64px] pointer-events-none z-0">
                    {/* Main vertical line from parent down to this node */}
                    <div className="absolute bottom-0 left-1/2 w-[2px] h-8 bg-gray-300 -translate-x-1/2" />

                    {/* Horizontal connector bar for siblings */}
                    {hasSiblings && (
                        <>
                            {/* Horizontal line spanning siblings */}
                            <div
                                className="absolute top-8 h-[2px] bg-gray-300"
                                style={{
                                    left: isFirst ? '50%' : '0',
                                    right: isLast ? '50%' : '0'
                                }}
                            />
                            {/* Vertical line from horizontal bar up to parent */}
                            {isFirst && (
                                <div className="absolute top-0 left-1/2 w-[2px] h-8 bg-gray-300 -translate-x-1/2" />
                            )}
                        </>
                    )}

                    {/* Single child - straight line */}
                    {!hasSiblings && (
                        <div className="absolute top-0 left-1/2 w-[2px] h-full bg-gray-300 -translate-x-1/2" />
                    )}
                </div>
            )}

            {/* Redesigned Node Card */}
            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-72 z-10 overflow-hidden group">
                {/* Header: Role */}
                <div className="bg-white border-b border-gray-50 p-4 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 text-base">{node.role}</h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button className="text-gray-400 hover:text-brand-blue" title="View details">
                            <UserCircle size={14} />
                        </button>
                    </div>
                </div>

                {/* Body: Profile */}
                <div className="p-4 bg-white border-b border-gray-50 flex items-center gap-4">
                    <div
                        className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-inner flex-shrink-0 cursor-pointer group/photo"
                        onClick={handlePhotoClick}
                    >
                        {node.photo ? (
                            <img src={node.photo} alt={node.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-brand-blue/5 text-brand-blue font-bold text-lg">
                                {node.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[8px] text-white font-bold uppercase">Change</span>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                    </div>
                    <div className="overflow-hidden flex-1">
                        <h4 className="font-medium text-gray-600 text-sm truncate">{node.name}</h4>
                        <div className="mt-1 flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${node.rating === 'Right Employee' ? 'bg-green-500' : 'bg-amber-500'}`} />
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{node.rating}</span>
                        </div>
                    </div>
                </div>

                {/* Manager Edit Section (Small) */}
                <div className="px-5 py-2 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Reports to</span>
                        {!isEditingManager && (
                            <button
                                onClick={() => setIsEditingManager(true)}
                                className="text-[9px] text-brand-blue font-bold hover:underline"
                            >
                                EDIT
                            </button>
                        )}
                    </div>
                    <div className="mt-1">
                        {isEditingManager ? (
                            <select
                                className="w-full bg-white border border-gray-200 rounded text-xs p-1 focus:outline-none focus:ring-1 focus:ring-brand-blue"
                                value={node.manager || ''}
                                onChange={handleManagerChange}
                                onBlur={() => setIsEditingManager(false)}
                                autoFocus
                            >
                                <option value="CEO">CEO / (Root)</option>
                                {allEmployees?.filter(emp => emp.name !== node.name).map(emp => (
                                    <option key={emp.name} value={emp.name}>{emp.name}</option>
                                ))}
                            </select>
                        ) : (
                            <span className="text-xs font-semibold text-gray-700">{node.manager || 'CEO'}</span>
                        )}
                    </div>
                </div>

                {/* Footer: Responsibilities */}
                <div className="p-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Roles and Responsibilities</span>
                        <button
                            onClick={() => setIsEditingResponsibilities(!isEditingResponsibilities)}
                            className="text-gray-300 hover:text-brand-blue"
                        >
                            <UserCircle size={12} />
                        </button>
                    </div>

                    {isEditingResponsibilities ? (
                        <textarea
                            className="w-full h-24 bg-gray-50 border border-gray-100 rounded-lg text-[11px] p-2 focus:outline-none focus:ring-1 focus:ring-brand-blue font-sans"
                            defaultValue={node.responsibilities?.join('\n')}
                            onBlur={(e) => {
                                handleResponsibilitiesChange(e);
                                setIsEditingResponsibilities(false);
                            }}
                            autoFocus
                            placeholder="Type each role in a new line..."
                        />
                    ) : (
                        <ul className="space-y-1.5">
                            {node.responsibilities && node.responsibilities.length > 0 ? (
                                node.responsibilities.map((role, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <div className="w-1 h-1 bg-gray-300 rounded-full mt-1.5 shrink-0" />
                                        <span className="text-[10px] text-gray-500 leading-tight">{role}</span>
                                    </li>
                                ))
                            ) : (
                                [1, 2, 3].map(i => (
                                    <li key={i} className="w-full h-1.5 bg-gray-50 rounded-full animate-pulse" />
                                ))
                            )}
                        </ul>
                    )}
                </div>
            </div>

            {/* Down Connector (Line from this node to children) - n8n style */}
            {node.children && node.children.length > 0 && (
                <div className="flex pt-16 relative">
                    {/* Clean vertical line going DOWN from this card to children's horizontal bar */}
                    <div className="absolute top-0 left-1/2 w-[2px] h-[30px] bg-gray-300 -translate-x-1/2 z-0" />

                    {/* Children row */}
                    {node.children.map((child, index) => (
                        <AccountabilityChartTree
                            key={index}
                            node={child}
                            isFirst={index === 0}
                            isLast={index === node.children.length - 1}
                            hasSiblings={node.children.length > 1}
                            isRoot={false}
                            onUpdateEmployee={onUpdateEmployee}
                            allEmployees={allEmployees}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const AccountabilityChartView = ({ employees, onUpdateEmployee }) => {
    // Transform flat list to tree
    const treeData = useMemo(() => {
        if (!employees || employees.length === 0) return [];

        const employeeMap = {};
        const roots = [];

        // 1. Initialize map
        employees.forEach(emp => {
            employeeMap[emp.name] = { ...emp, children: [] };
        });

        // 2. Build relationships
        employees.forEach(emp => {
            const node = employeeMap[emp.name];
            // Normalize manager name (trim whitespace)
            const managerName = emp.manager ? emp.manager.trim() : '';

            if (managerName && employeeMap[managerName]) {
                employeeMap[managerName].children.push(node);
            } else {
                // If manager doesn't exist in our employee list, this node is a root
                // Or if manager is 'CEO' and no employee is named CEO.
                // We might want to group these under a virtual "CEO" node if multiple?
                // For now, let's just make them roots.
                roots.push(node);
            }
        });

        // Handle case where specific "CEO" string is used as manager but not an employee record
        // We can create a virtual root if multiple people report to "CEO"
        // But for simplicity, let's just return the found roots.

        return roots;
    }, [employees]);

    return (
        <div className="min-h-[calc(100vh-12rem)] overflow-auto bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-8 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-sm text-gray-500 italic">Visual organization structure and hierarchy. Click on "Reports to" to reassign managers.</p>
                </div>
                <div className="bg-white px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-500 shadow-sm">
                    {employees.length} Employees
                </div>
            </div>

            <div className="flex justify-center min-w-max pb-16">
                {treeData.map((node, i) => (
                    <div key={i} className="mx-8">
                        {/* Root nodes wrapper */}
                        <AccountabilityChartTree
                            node={node}
                            isFirst={true}
                            isLast={true}
                            hasSiblings={false}
                            isRoot={true}
                            onUpdateEmployee={onUpdateEmployee}
                            allEmployees={employees}
                        />
                        {/* Note: Roots usually don't have siblings lines above them in this visual, 
                             so we pass flags to disable top connectors for the absolute root.
                             But wait, my component logic assumes there is a parent if hasSiblings is checked? 
                             Actually the top connector logic relies on !hasSiblings check displaying the single vertical line. 
                             I need to suppress the top connector for the very ROOT.
                         */}
                    </div>
                ))}

                {treeData.length === 0 && (
                    <div className="text-center text-gray-400 py-12">
                        <UserCircle size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No employees found or structure not defined.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
