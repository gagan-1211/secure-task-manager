import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (error) {
            setError('root', {
                type: 'manual',
                message: error.response?.data?.error || 'Login failed'
            });
        }
    };

    return (
        <Layout>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md relative group">
                    {/* Gradient Border Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-orange-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>

                    <div className="relative bg-neutral-900 border border-white/10 p-8 rounded-xl shadow-2xl">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 text-fuchsia-500">
                                <LogIn size={20} />
                            </div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-orange-400">Welcome Back</h2>
                            <p className="text-gray-400 text-sm mt-1">Sign in to continue to your dashboard</p>
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

                            {errors.root && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                    {errors.root.message}
                                </div>
                            )}

                            <Button type="submit" variant="primary" className="w-full py-2.5" disabled={isSubmitting}>
                                {isSubmitting ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-400">
                            Don't have an account? <Link to="/register" className="text-fuchsia-400 hover:text-fuchsia-300 transition-colors font-medium">Create acccount</Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
