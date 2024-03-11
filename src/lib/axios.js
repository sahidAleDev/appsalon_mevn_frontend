import axios from 'axios';

/*
  interceptors: son funciones que se ejecutan antes o después de que una petición sea realizada.

  Existen dos tipos de interceptors:
  - request: se ejecuta antes de que la petición sea realizada.
  - response: se ejecuta después de que la petición es realizada.
*/


const api = axios.create({
  baseURL : import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("AUTH_TOKEN");
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;

  /*
    En el codigo anterior:
    - Se obtiene el token del localStorage.
    - Si el token existe, se agrega al header de la petición.
    - Se retorna el objeto config.

    De esta forma, cada vez que se realice una petición, el token será agregado al header.
  */
})

export default api;

