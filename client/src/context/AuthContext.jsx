import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const register = (username, email, password) => {
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'البريد الإلكتروني مسجل بالفعل' };
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            username,
            email,
            password, // In production, this should be hashed!
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after registration
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

        return { success: true, message: 'تم التسجيل بنجاح' };
    };

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
        }

        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

        return { success: true, message: 'تم تسجيل الدخول بنجاح' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    const updateProfile = (newData) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);

        if (userIndex === -1) {
            return { success: false, message: 'خطأ في تحديث البيانات' };
        }

        // Check if email is already taken by another user
        if (newData.email !== user.email && users.find(u => u.email === newData.email)) {
            return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' };
        }

        // Update user data
        users[userIndex] = { ...users[userIndex], ...newData };
        localStorage.setItem('users', JSON.stringify(users));

        // Update current user
        const updatedUser = { ...users[userIndex] };
        delete updatedUser.password;
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        return { success: true, message: 'تم تحديث البيانات بنجاح' };
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
