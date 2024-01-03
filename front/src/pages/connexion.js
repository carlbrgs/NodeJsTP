import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function Connexion() {
  const ls = localStorage;
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      console.log('connexion', data);
      const response = await Axios.post('http://localhost:3001/connexion', data);

      if (response.status === 200) {
        ls.setItem("email", response.data.Email);
        console.log(ls);
        alert("Connexion réussie");
        navigate("/");
      } else {
        alert("Erreur de connexion");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4">
        <h5 className="card-title text-center mb-4">Connexion</h5>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="taille">Adresse Mail</label>
            <input
              {...register("Email", { required: true })}
              type="email"
              className={`form-control ${errors.Email ? 'is-invalid' : ''}`}
            />
            {errors.Email && <div className="invalid-feedback">Ce champ est requis.</div>}
          </div>
          <div className="form-group">
            <label htmlFor="mdp" className="taille">Mot de passe</label>
            <input
              {...register("Mdp", { required: true })}
              type="password"
              className={`form-control ${errors.Mdp ? 'is-invalid' : ''}`}
            />
            {errors.Mdp && <div className="invalid-feedback">Ce champ est requis.</div>}
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary mr-2">Connexion</button>
            <button type="reset" className="btn btn-warning">Supprimer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
