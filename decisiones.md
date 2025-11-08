# TP 7: Code coverages

Configurar Jest para que genere reportes de coverage
Ver qué partes del código NO están siendo testeadas
Agregar tests donde falten
Llegar al 70% mínimo

Primero configuraros coverage en el backend, para esto modificamos jest.config.js

Opción¿Qué hace?
collectCoverage:true Activa la medición de coverage
collectCoverageFrom Qué archivos analizar
coverageDirectory Dónde guardar los reportes
coverageReporters Formatos del reporte (texto, HTML, JSON)
coverageThreshold Mínimo requerido (70%)

Luego corremos los tests del back con coverage con 
cd backend
npm test -- --coverage

foto coverage en la consola

o tambien lo podemos ver en un reporte de html detallado con 
start coverage/index.html
![alt text](image2.png)

Luego pasamos al front, configuramos el coverage en jest.config.js y corrimos para ver como estaba el porcentaje.
Vimos que en % de funciones estaba abajo del 70% con 5/8 funciones cubiertas.
![alt text](image3.png)

Por lo que implementamos un test mas para cubrir mas codigo y con esto logramos un 75% lo que cubre el minimo solicitado
![alt text](image4.png)

