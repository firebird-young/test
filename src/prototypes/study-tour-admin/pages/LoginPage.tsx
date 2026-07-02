import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Smartphone } from 'lucide-react';
import PhoneFrame from '../components/PhoneFrame';
import logo from '../assets/logo.jpeg';

interface LoginPageProps {
    onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [remember, setRemember] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <PhoneFrame>
            <div className="login-app">
                {/* ===== Logo 区域 ===== */}
                <div className="login-logo">
                    <img className="logo-img" src={logo} alt="机构 Logo" />
                </div>

                <div className="login-brand">
                    <h1>星辰研学</h1>
                    <p>课程管理平台 · 机构版</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label className="field">
                        <Smartphone size={18} />
                        <input
                            type="text"
                            inputMode="tel"
                            placeholder="请输入手机号 / 机构账号"
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                        />
                    </label>

                    <label className="field">
                        <Lock size={18} />
                        <input
                            type={showPwd ? 'text' : 'password'}
                            placeholder="请输入登录密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="pwd-toggle"
                            onClick={() => setShowPwd((v) => !v)}
                            aria-label={showPwd ? '隐藏密码' : '显示密码'}
                        >
                            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </label>

                    <div className="login-row">
                        <button
                            type="button"
                            className={remember ? 'remember on' : 'remember'}
                            onClick={() => setRemember((v) => !v)}
                        >
                            <span className="checkbox" />
                            记住账号
                        </button>
                        <button type="button" className="forgot">
                            忘记密码？
                        </button>
                    </div>

                    <button type="submit" className="login-btn">
                        登录
                    </button>
                </form>

                <p className="login-foot">
                    登录即代表同意《服务协议》与《隐私政策》
                    <br />
                    星辰研学机构版 v1.0
                </p>
            </div>
        </PhoneFrame>
    );
}
