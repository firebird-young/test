/**
 * @name 登录
 */

import React, { useMemo, useState } from 'react';
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import {
    AnnotationViewer,
    type AnnotationSourceDocument,
    type AnnotationViewerOptions,
} from '@axhub/annotation';
import annotationSourceDocument from './annotation-source.json';
import './style.css';

interface FormErrors {
    email?: string;
    password?: string;
}

const FEATURES = [
    '端到端加密，数据安全无忧',
    '实时同步，跨设备无缝衔接',
    '智能提醒，不遗漏重要事项',
];

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    const validate = (): boolean => {
        const next: FormErrors = {};
        if (!email.trim()) {
            next.email = '请输入邮箱地址';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            next.email = '邮箱格式不正确';
        }
        if (!password) {
            next.password = '请输入密码';
        } else if (password.length < 6) {
            next.password = '密码至少 6 位字符';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // 模拟登录请求
        window.setTimeout(() => setLoading(false), 2000);
    };

    const clearError = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const viewerOptions = useMemo<AnnotationViewerOptions>(() => ({
        showToolbar: true,
        showThemeToggle: true,
        showColorFilter: true,
        emptyWhenNoData: false,
        toolbarEdge: 'right',
    }), []);

    return (
        <div className="min-h-screen w-full flex bg-slate-50">
            {/* ============ 左侧品牌区 ============ */}
            <div className="brand-panel relative hidden overflow-hidden md:flex md:w-[44%] lg:w-[48%]">
                <div className="brand-gradient absolute inset-0" />
                {/* 装饰圆环 */}
                <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/10" />
                <div className="absolute -right-12 -top-12 h-72 w-72 rounded-full border border-white/10" />
                <div className="absolute -left-16 bottom-10 h-80 w-80 rounded-full bg-white/5 blur-2xl" />

                {/* 内容 */}
                <div className="relative z-10 flex w-full flex-col justify-between p-10 text-white lg:p-14">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                            <span className="text-lg font-bold">N</span>
                        </div>
                        <span className="text-xl font-semibold tracking-tight">Nimbus</span>
                    </div>

                    {/* 标语 + 价值说明 */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
                            让团队协作
                            <br />
                            如行云流水
                        </h1>
                        <p className="max-w-sm text-base leading-relaxed text-white/70 lg:text-lg">
                            一站式项目管理与沟通平台，帮助团队更高效地规划、协作和交付。
                        </p>
                        <ul className="space-y-3 pt-2">
                            {FEATURES.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-3 text-sm text-white/80"
                                >
                                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/15">
                                        <Check className="h-3 w-3" strokeWidth={3} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 底部 */}
                    <p className="text-xs text-white/40">© 2026 Nimbus Inc. 保留所有权利</p>
                </div>
            </div>

            {/* ============ 右侧表单区 ============ */}
            <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
                <div className="w-full max-w-md">
                    {/* 移动端 Logo */}
                    <div className="mb-8 flex items-center gap-3 md:hidden">
                        <div className="brand-gradient flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white">
                            N
                        </div>
                        <span className="text-xl font-semibold tracking-tight text-slate-900">
                            Nimbus
                        </span>
                    </div>

                    {/* 标题 */}
                    <div className="mb-8">
                        <h2
                            data-annotation-id="welcome-title"
                            className="chinese-font text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl"
                        >
                            欢迎回来
                        </h2>
                        <p className="mt-2 text-slate-500">登录以继续使用您的账户</p>
                    </div>

                    {/* 表单 */}
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* 邮箱 */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-slate-700"
                            >
                                邮箱地址
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        clearError('email');
                                    }}
                                    placeholder="name@company.com"
                                    className={`input-base pl-11 ${errors.email ? 'input-error' : ''}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* 密码 */}
                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-slate-700"
                                >
                                    密码
                                </label>
                                <button
                                    type="button"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                                >
                                    忘记密码？
                                </button>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        clearError('password');
                                    }}
                                    placeholder="至少 6 位字符"
                                    className={`input-base pl-11 pr-11 ${
                                        errors.password ? 'input-error' : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label={showPassword ? '隐藏密码' : '显示密码'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-[18px] w-[18px]" />
                                    ) : (
                                        <Eye className="h-[18px] w-[18px]" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* 记住我 */}
                        <label className="flex cursor-pointer select-none items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setRememberMe((v) => !v)}
                                className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border-2 transition-colors ${
                                    rememberMe
                                        ? 'border-indigo-600 bg-indigo-600'
                                        : 'border-slate-300 bg-white'
                                }`}
                                aria-pressed={rememberMe}
                                aria-label="记住我"
                            >
                                {rememberMe && (
                                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                                )}
                            </button>
                            <span className="text-sm text-slate-600">记住我</span>
                        </label>

                        {/* 登录按钮 */}
                        <button type="submit" disabled={loading} className="submit-btn">
                            {loading ? (
                                <>
                                    <span className="spinner" />
                                    登录中...
                                </>
                            ) : (
                                <>
                                    登录
                                    <ArrowRight className="h-[18px] w-[18px]" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* 注册链接 */}
                    <p className="mt-8 text-center text-sm text-slate-500">
                        还没有账户？
                        <button className="ml-1 font-semibold text-indigo-600 hover:text-indigo-700">
                            立即注册
                        </button>
                    </p>
                </div>
            </div>

            <AnnotationViewer
                source={annotationSourceDocument as AnnotationSourceDocument}
                options={viewerOptions}
            />
        </div>
    );
}
