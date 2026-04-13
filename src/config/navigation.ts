import { Binary, FlaskConical, LayoutDashboard, Orbit, ShieldAlert } from 'lucide-react';
import type { NavRoute } from '../types';

export const navRoutes: NavRoute[] = [
  { path: '/', label: '总览', icon: LayoutDashboard },
  { path: '/protocol', label: '协议提取', icon: Orbit },
  { path: '/seed', label: '种子工坊', icon: Binary },
  { path: '/risk', label: '风险分析', icon: ShieldAlert },
  { path: '/fuzz', label: '模糊测试', icon: FlaskConical },
];
