/**
 * @name 研学机构端
 */

import React from 'react';
import { defineHashPageRoute, useHashPage } from '../../common/useHashPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import './style.css';

const route = defineHashPageRoute(
    [
        { id: 'login', title: '机构登录' },
        { id: 'home', title: '课程首页' },
    ],
    { defaultPageId: 'login' },
);

export default function StudyTourAdmin() {
    const { page, setPage } = useHashPage(route);

    if (page === 'home') {
        return <HomePage />;
    }
    return <LoginPage onLogin={() => setPage('home')} />;
}
