import { Routes, Route } from 'react-router'; 

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';


import CafeList from './components/CafeList/CafeList';
import CafeDetail from './components/CafeDetail/CafeDetail';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <Routes>
        {
          user ?
          <>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/products' element={<h1>Producs</h1>}/>
            <Route path='/favs' element={<h1>Favs</h1>}/>
            <Route path='/profile' element={<h1>{user.username}</h1>}/>
            <Route path='/orders' element={<h1>ORDERS</h1>}/>

            {/* Café routes */}
            <Route path='/cafes' element={<CafeList />} />
            <Route path='/cafes/:id' element={<CafeDetail />} />
            
            {/* Admin only route */}
            {user.role === 'admin' && (
              <Route path='/admin/cafes' element={<AdminDashboard />} />
            )}
          </>
            :
            <>
              <Route path='/' element={<Landing/>}/>
         
              <Route path='/cafes' element={<CafeList />} />
              <Route path='/cafes/:id' element={<CafeDetail />} />
            </>
        }
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
};

export default App;