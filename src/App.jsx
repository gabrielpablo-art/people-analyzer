import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './components/DashboardView';
import { EvaluationView } from './components/EvaluationView';
import { AdminView } from './components/AdminView';
import { ConfigurationView } from './components/ConfigurationView';
import { Mail } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showToast, setShowToast] = useState(false);

  // Centralized State
  const [coreValues, setCoreValues] = useState(['Humble', 'Hungry', 'Smart', 'Compass', 'Transp']);

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Juan Perez',
      role: 'CTO',
      manager: 'CEO',
      status: 'Ready',
      values: ['+', '+', '+', '±', '+'],
      gwc: ['Y', 'Y', 'Y'],
      rating: 'The Right Person',
      feedback: ["Consistent high performer, needs to delegate more.", "Technically brilliant but sometimes lacks patience."]
    },
    {
      id: 2,
      name: 'Maria Gomez',
      role: 'HR Manager',
      manager: 'CEO',
      status: 'In Review',
      values: ['+', '±', '+', '+', '±'],
      gwc: ['Y', 'Y', 'Y'],
      rating: 'The Right Person',
      feedback: ["Great cultural fit, very improved in process management."]
    },
    {
      id: 3,
      name: 'Carlos Ruiz',
      role: 'Dev Lead',
      manager: 'CTO',
      status: 'Waiting',
      values: ['+', '+', '-', '±', '+'],
      gwc: ['Y', 'Y', 'N'],
      rating: 'Wrong Seat',
      feedback: ["Struggling with the new team capacity demands."]
    },
    {
      id: 4,
      name: 'Ana Lopez',
      role: 'Designer',
      manager: 'CTO',
      status: 'Waiting',
      values: ['±', '-', '±', '±', '-'],
      gwc: ['Y', 'N', 'Y'],
      rating: 'Wrong Person',
      feedback: ["Missed several deadlines this quarter.", "Not aligned with core values lately."]
    },
  ]);

  const handleLaunch = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddEmployee = (newEmp) => {
    setEmployees([...employees, { ...newEmp, id: Date.now(), feedback: [] }]);
  };

  const handleSubmitEvaluation = (evaluationData) => {
    // Logic to update employee data based on evaluation
    // For prototype, we'll just push the feedback to the first employee (mocking selection)
    const updatedEmployees = [...employees];
    const target = updatedEmployees[0]; // Mock: always updating Juan for now in this flow

    if (evaluationData.feedback) {
      target.feedback.push(evaluationData.feedback);
    }
    setEmployees(updatedEmployees);
    setActiveTab('dashboard');
  };

  // Configuration Handlers
  const addCoreValue = (val) => setCoreValues([...coreValues, val]);
  const removeCoreValue = (index) => setCoreValues(coreValues.filter((_, i) => i !== index));
  const updateCoreValue = (index, newVal) => {
    const updated = [...coreValues];
    updated[index] = newVal;
    setCoreValues(updated);
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'dashboard' && (
        <DashboardView
          employees={employees}
          coreValues={coreValues}
        />
      )}

      {activeTab === 'admin' && (
        <AdminView
          employees={employees}
          onAddEmployee={handleAddEmployee}
          onLaunch={handleLaunch}
          coreValues={coreValues}
        />
      )}

      {activeTab === 'evaluation' && (
        <EvaluationView
          onBack={() => setActiveTab('dashboard')}
          onSubmit={handleSubmitEvaluation}
          coreValues={coreValues}
        />
      )}

      {activeTab === 'settings' && (
        <ConfigurationView
          coreValues={coreValues}
          onAddValue={addCoreValue}
          onRemoveValue={removeCoreValue}
          onUpdateValue={updateCoreValue}
        />
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-300 z-50">
          <div className="w-8 h-8 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center">
            <Mail size={16} />
          </div>
          <div>
            <p className="text-sm font-bold">Evaluations Launched!</p>
            <p className="text-xs text-gray-400">Invitations sent to {employees.length} employees.</p>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
