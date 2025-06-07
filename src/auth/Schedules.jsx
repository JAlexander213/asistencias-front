import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
function Schedules(){
    const navigate = useNavigate();

     useEffect(() => {
      const auth = localStorage.getItem("auth");
      if (!auth) {
        navigate("/auth/login", { replace: true });
      }
    }, [navigate]);

    return(
        <div>
            <h1>Horarios</h1>
        </div>
    )
}
export default Schedules