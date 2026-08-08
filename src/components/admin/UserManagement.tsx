import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { VelocityAPI } from '../../services/api';
import { Users, Search, Plus, Edit2, Trash2, CheckCircle2, Filter, X } from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';

interface UserManagementProps {
  users: User[];
  isCoach?: boolean;
  onUsersUpdated: () => void;
  onShowToast: (msg: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  isCoach = false,
  onUsersUpdated,
  onShowToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [coachPosition, setCoachPosition] = useState<string>('Senior Coach');
  const [fitnessGoals, setFitnessGoals] = useState('');

  // If coach, filter strictly to clients
  const targetUsers = isCoach ? users.filter((u) => u.role === 'client') : users;

  const filteredUsers = targetUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenCreateClient = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('client');
    setCoachPosition('Senior Coach');
    setFitnessGoals('');
    setShowModal(true);
  };

  const handleOpenCreateCoach = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('coach');
    setCoachPosition('Head Coach');
    setFitnessGoals('UK Certified Fitness & Strength Master Coach');
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setRole(user.role);
    setCoachPosition(user.coachPosition || 'Senior Coach');
    setFitnessGoals(user.fitnessGoals || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      onShowToast('Name and email are required');
      return;
    }

    const targetRole = isCoach ? 'client' : role;
    const finalCoachPos = targetRole === 'coach' ? coachPosition : undefined;

    try {
      if (editingUser) {
        VelocityAPI.updateUser(editingUser.id, {
          name,
          email,
          phone,
          role: targetRole,
          coachPosition: finalCoachPos,
          fitnessGoals
        });

        // Sync with PostgreSQL database via API
        fetch(`/api/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, role: targetRole, coachPosition: finalCoachPos })
        }).catch(() => {});

        onShowToast(`Updated ${targetRole.toUpperCase()} profile for ${name}`);
      } else {
        VelocityAPI.createUser({
          name,
          email,
          phone,
          role: targetRole,
          coachPosition: finalCoachPos,
          fitnessGoals
        });

        // Sync with PostgreSQL database via API
        fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, role: targetRole, coachPosition: finalCoachPos, fitnessGoals })
        }).catch(() => {});

        onShowToast(`Created new ${targetRole.toUpperCase()} account for ${name}`);
      }

      setShowModal(false);
      onUsersUpdated();
    } catch (err: any) {
      onShowToast(err.message || 'Operation failed');
    }
  };

  const [deletingUser, setDeletingUser] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteTrigger = (id: string, userName: string) => {
    setDeletingUser({ id, name: userName });
  };

  const confirmDelete = () => {
    if (deletingUser) {
      VelocityAPI.deleteUser(deletingUser.id);
      fetch(`/api/users/${deletingUser.id}`, { method: 'DELETE' }).catch(() => {});
      onShowToast(`Deleted account "${deletingUser.name}" permanently from database`);
      setDeletingUser(null);
      onUsersUpdated();
    }
  };

  const handleToggleVerify = (id: string, userName: string) => {
    VelocityAPI.toggleVerifyUser(id);
    onShowToast(`Toggled verification status for ${userName}`);
    onUsersUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8C532B]" />
            {isCoach ? 'MY CLIENT & ATHLETE ROSTER' : 'CUSTOMER & ATHLETE DIRECTORY (CRM)'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isCoach
              ? 'View client profiles, add new clients, update fitness goals, and manage your athlete roster.'
              : 'Manage user accounts, add/delete coaches, assign roles, verify profiles, edit contact information, and delete users.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isCoach && (
            <button
              onClick={handleOpenCreateCoach}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black tracking-widest px-4 py-3 uppercase transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADD COACH</span>
            </button>
          )}

          <button
            onClick={handleOpenCreateClient}
            className="bg-[#8C532B] hover:bg-[#70401E] text-white text-xs font-black tracking-widest px-4 py-3 uppercase transition-all shadow-md shadow-amber-950/20 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isCoach ? 'ADD CLIENT' : '+ ADD CLIENT / USER'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#111111] border border-gray-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients by name or email..."
            className="w-full bg-gray-900 border border-gray-800 focus:border-[#E52165] text-white pl-9 pr-4 py-2 text-xs rounded-none outline-none"
          />
        </div>

        {!isCoach && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-400 uppercase">Role Filter:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-900 border border-gray-800 text-white text-xs px-3 py-2 rounded-none outline-none"
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="client">Clients Only</option>
              <option value="coach">Coaches Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
        )}
      </div>

      {/* CRM Users Table */}
      <div className="bg-[#111111] border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800 text-gray-400 uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Client Details</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Fitness Goals</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[#E52165]"
                    />
                    <div>
                      <span className="font-bold text-white block text-sm">{u.name}</span>
                      <span className="text-gray-400 text-xs">{u.email}</span>
                      {u.phone && <span className="block text-[10px] text-gray-500 font-mono">{u.phone}</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`px-2.5 py-1 font-black uppercase text-[10px] border ${
                          u.role === 'admin'
                            ? 'bg-purple-950 text-purple-300 border-purple-800'
                            : u.role === 'coach'
                            ? 'bg-pink-950 text-pink-300 border-pink-800'
                            : u.role === 'user'
                            ? 'bg-blue-950 text-blue-300 border-blue-800'
                            : 'bg-gray-800 text-gray-300 border-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                      {u.role === 'coach' && (
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                          {u.coachPosition || 'Senior Coach'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleVerify(u.id, u.name)}
                      className={`text-[10px] font-bold px-2 py-0.5 border uppercase flex items-center gap-1 ${
                        u.isVerified
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {u.isVerified ? 'VERIFIED' : 'PENDING'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-gray-400">
                    {u.fitnessGoals || 'No goal stated'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                        title="Edit Client Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrigger(u.id, u.name)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded transition-colors"
                        title="Delete Client Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-bold uppercase tracking-wider">
                    No user accounts found in directory. Real accounts registered will display here live.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Create/Edit User */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111111] text-white border border-gray-800 p-6 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black uppercase text-white mb-4">
              {editingUser
                ? `EDIT CLIENT: ${editingUser.name}`
                : isCoach
                ? 'ADD NEW CLIENT PROFILE'
                : 'CREATE NEW USER ACCOUNT'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 text-white px-3.5 py-2 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 text-white px-3.5 py-2 text-sm outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 text-white px-3.5 py-2 text-sm outline-none"
                  />
                </div>

                {!isCoach && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                      Assign Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full bg-gray-900 border border-gray-800 text-white px-2 py-2 text-sm outline-none"
                    >
                      <option value="client">Client / Athlete</option>
                      <option value="user">Member / User</option>
                      <option value="coach">Fitness Coach</option>
                      <option value="admin">System Admin</option>
                    </select>
                  </div>
                )}
              </div>

              {role === 'coach' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                    Coach Position Level *
                  </label>
                  <select
                    value={coachPosition}
                    onChange={(e) => setCoachPosition(e.target.value)}
                    className="w-full bg-gray-900 border border-amber-800/80 text-white px-3 py-2 text-xs font-bold outline-none rounded-none"
                  >
                    <option value="Head Coach">Head Coach</option>
                    <option value="Super Senior Coach">Super Senior Coach</option>
                    <option value="Senior Coach">Senior Coach</option>
                    <option value="Junior Coach">Junior Coach</option>
                    <option value="Lead Performance Specialist">Lead Performance Specialist</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Fitness Goals / Coaching Notes
                </label>
                <textarea
                  rows={2}
                  value={fitnessGoals}
                  onChange={(e) => setFitnessGoals(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 text-white p-3.5 text-xs outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E52165] hover:bg-[#c41551] text-white text-xs font-black tracking-widest py-3 uppercase shadow-md shadow-pink-500/20"
              >
                {editingUser ? 'SAVE CHANGES' : isCoach ? 'SAVE CLIENT PROFILE' : 'CREATE USER NOW'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Confirm Modal for Delete User */}
      <ConfirmModal
        isOpen={!!deletingUser}
        title="DELETE CLIENT ACCOUNT"
        message={`Are you sure you want to permanently delete the client account for "${deletingUser?.name}"? This action cannot be undone.`}
        type="danger"
        confirmText="DELETE PERMANENTLY"
        cancelText="KEEP ACCOUNT"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingUser(null)}
      />
    </div>
  );
};
