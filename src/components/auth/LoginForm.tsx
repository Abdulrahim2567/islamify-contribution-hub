import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Info } from "lucide-react";
import { Member } from "@/types/types";
import { readMembersFromStorage } from "@/utils/membersStorage";

interface LoginFormProps {
	users: Member[];
	onLogin: (user: Member) => void;
	onRequirePasswordChange: (user: Member) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	toast: any;
}

const LOCAL_STORAGE_KEY = "islamify_logged_in_user";

const LoginForm = ({
	users,
	onLogin,
	onRequirePasswordChange,
	toast,
}: LoginFormProps) => {
	const [loginForm, setLoginForm] = useState({ email: "", password: "" });
	const [user, setUser] = useState<Member>();

	// Auto login if user exists in localStorage
	useEffect(() => {
		const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (stored) {
			try {
				const parsed: Member = JSON.parse(stored);
				// Revalidate against current members
				const members = readMembersFromStorage();
				const validUser = members.find(
					(u) =>
						u.email === parsed.email &&
						u.password === parsed.password
				);
				if (validUser) {
					setUser(validUser);
					onLogin(validUser);
					toast({
						title: "Welcome back!",
						description: `Logged in automatically as ${validUser.role}`,
					});
				} else {
					localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid
				}
			} catch {
				localStorage.removeItem(LOCAL_STORAGE_KEY);
			}
		}
	}, []);

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		const members: Member[] = readMembersFromStorage();

		const foundUser = members.find(
			(u) =>
				u.email === loginForm.email && u.password === loginForm.password
		);

		if (!foundUser) {
			toast({
				title: "Login Failed",
				description: "Invalid email or password",
				variant: "destructive",
			});
			setUser(undefined);
			return;
		}

		setUser(foundUser);

		if (!foundUser.isActive) return;

		// Store in localStorage
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(foundUser));

		if (foundUser.needsPasswordChange) {
			onRequirePasswordChange(foundUser);
			toast({
				title: "Password Change Required",
				description: "Please change your default password to continue.",
			});
		} else {
			onLogin(foundUser);
			toast({
				title: "Welcome to Islamify",
				description: `Logged in successfully as ${foundUser.role}`,
			});
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[440px] px-2">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="flex flex-col items-center pb-2">
					<div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
						<LogIn className="w-8 h-8 text-white" />
					</div>
					<CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-300 mb-1">
						Sign In
					</CardTitle>
					<CardDescription>
						Access your Islamify account
					</CardDescription>
				</CardHeader>

				<div className="bg-emerald-50 border border-emerald-200 border-dashed dark:border-emerald-200/50 dark:bg-emerald-400/5 rounded-lg p-4 mx-6 mb-5 mt-2 text-center">
					<p className="text-sm text-emerald-800 dark:text-emerald-300/70">
						Sign in as an admin or member to get started.
						<br />
						<span className="text-xs text-emerald-600 dark:text-emerald-700">
							Use your email and password. Default users are
							provided below for demo.
						</span>
					</p>
				</div>

				<CardContent>
					<form onSubmit={handleLogin} className="space-y-6 mt-2">
						{/* Email */}
						<div>
							<Label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Email
							</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-emerald-500">
									<Mail className="w-5 h-5 input-icon" />
								</span>
								<Input
									id="email"
									type="email"
									className="pl-10"
									value={loginForm.email}
									onChange={(e) =>
										setLoginForm((prev) => ({
											...prev,
											email: e.target.value,
										}))
									}
									placeholder="Enter your email"
									required
									autoFocus
								/>
							</div>
						</div>

						{/* Password */}
						<div>
							<Label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Password
							</Label>
							<div className="relative">
								<span className="absolute inset-y-0 left-0 pl-3 flex items-center text-blue-500">
									<Lock className="w-5 h-5 input-icon" />
								</span>
								<Input
									id="password"
									type="password"
									className="pl-10"
									value={loginForm.password}
									onChange={(e) =>
										setLoginForm((prev) => ({
											...prev,
											password: e.target.value,
										}))
									}
									placeholder="Enter your password"
									required
								/>
							</div>
						</div>

						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold transition-colors"
						>
							<LogIn className="w-4 h-4 mr-2" />
							Sign In
						</Button>
					</form>

					{user && !user.isActive && (
						<div className="mt-5 flex text-center text-sm rounded-lg border border-dashed border-yellow-100 dark:border-yellow-100/50 bg-yellow-50 dark:bg-yellow-300/5 p-3">
							<Info className=" dark:text-yellow-400 text-yellow-600" />
							<p className="font-semibold mb-1 ml-2 dark:text-yellow-300/70 text-yellow-600">
								Account temporarily disabled. Please contact
								your admin.
							</p>
						</div>
					)}

					<div className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300 rounded-lg border border-dashed border-blue-100 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-300/5 p-3">
						<p className="font-semibold mb-1">Demo credentials:</p>
						<p>
							<span className="font-medium text-blue-700 dark:text-blue-700/75">
								Admin:
							</span>
							&nbsp; admin@islamify.org / admin123
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginForm;
