import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
    const { register: registerUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await registerUser(data.email, data.password, data.role);
            navigate('/dashboard');
        } catch (error) {
            setError('root', {
                type: 'manual',
                message: error.response?.data?.error || 'Registration failed'
            });
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md relative group">
                    {/* Gradient Border Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-fuchsia-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>

                    <div className="relative bg-neutral-900 border border-white/10 p-8 rounded-xl shadow-2xl">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 text-orange-500">
                                <UserPlus size={20} />
                            </div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-fuchsia-400">Create Account</h2>
                            <p className="text-gray-400 text-sm mt-1">Join Secure Task Manager today</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email', { required: 'Email is required' })}
                                error={errors.email}
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password', { required: 'Password is required' })}
                                error={errors.password}
                            />
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-300">Role</label>
                                <select
                                    {...register('role')}
                                    className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all backdrop-blur-sm focus:border-orange-500/50"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            {errors.root && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                    {errors.root.message}
                                </div>
                            )}

                            <Button type="submit" variant="primary" className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-fuchsia-600 hover:opacity-90 shadow-orange-500/20" disabled={isSubmitting}>
                                {isSubmitting ? 'Creating account...' : 'Get Started'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-400">
                            Already have an account? <Link to="/login" className="text-orange-400 hover:text-orange-300 transition-colors font-medium">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Register;
