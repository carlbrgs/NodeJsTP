import 'bootstrap/dist/css/bootstrap.min.css'; 
import Navbar from './composants/navbar';
import Footer from './composants/footer';

import { Route, Routes } from 'react-router-dom';
import Inscription from './pages/inscription';
import Connexion from './pages/connexion';
import Commentaire from './pages/commentaire';


function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/Inscription" element={<Inscription/>}/>
      <Route path="/Connexion" element={<Connexion/>}/>
      <Route path="/" element={<Commentaire/>}/>
    </Routes>
    <Footer/>
    </>
  );
}

export default App;
