import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [user,setUser]=useState(()=>JSON.parse(localStorage.getItem('tuneFoxUser')||'null'));
  const [token,setToken]=useState(()=>localStorage.getItem('tuneFoxToken'));
  const [loading,setLoading]=useState(false);
  const save=(p)=>{setUser(p.user);setToken(p.token);localStorage.setItem('tuneFoxUser',JSON.stringify(p.user));localStorage.setItem('tuneFoxToken',p.token);};
  const login=async(form)=>{const {data}=await api.post('/auth/login',form);save(data);toast.success('Welcome back to Tune Fox');};
  const register=async(form)=>{const {data}=await api.post('/auth/register',form);save(data);toast.success('Account created');};
  const logout=()=>{setUser(null);setToken(null);localStorage.removeItem('tuneFoxUser');localStorage.removeItem('tuneFoxToken');toast.success('Logged out');};
  useEffect(()=>{if(!token)return;setLoading(true);api.get('/auth/me').then(({data})=>{setUser(data.user);localStorage.setItem('tuneFoxUser',JSON.stringify(data.user));}).catch(()=>logout()).finally(()=>setLoading(false));},[token]);
  const value=useMemo(()=>({user,token,loading,login,register,logout,isAdmin:user?.role==='admin'}),[user,token,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
