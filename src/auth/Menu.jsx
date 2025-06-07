import React, { useState } from "react";

export const Menu=()=>{
    const [isOpen, setIsOpen]= useState(false);

    const toogleMenu=()=>{
        setIsOpen(!isOpen);
    }
    return( 
        <div className="relativa">
            <i className="ion-navicon-round"
            style={{
            fontSize: "2.2rem",
            color: "rgb(0, 0, 0)", 
            cursor: "pointer",
            transition: "color 0.2s",
            }}
            onClick={toogleMenu}
            ></i>
            <div className={`fixed top-0 right-0 h-full h-w64 bg-green-50 shadow-lg transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out lg:hidden z-50`}>
                <div className='flex justify-end p-4'>
                    <i className="ion-close-round" onClick={toogleMenu} style={{ fontSize: "2.2rem", color: "rgb(0, 0, 0)", cursor: "pointer", transition: "color 0.2s" }}></i>
                </div>
                <ul className="text-white flex flex-col items-center justify-center space-y-6 mt-10 ">
                    <li>
                        Hola
                    </li>
                    <li>
                        adios
                    </li>
                </ul>
            </div>
            
        </div>
    )
}

