
# Proyecto Observatorios

Este repositorio contiene el cliente del sistema de gestión para observatorios. Su función principal es consumir los endpoints del API de `observatorios_crud`, permitiendo a los usuarios interactuar con los datos de manera intuitiva y eficiente.

## Especificaciones Técnicas

### Tecnologías Implementadas

- [Vue.js](https://vuejs.org) (versión 3.5.13): Framework principal para el desarrollo del cliente.

#### Requisitos previos
Antes de comenzar, asegúrate de tener instalado:

- **[Node.js](https://nodejs.org/)** (versión recomendada: 16+ o 18+)
- **npm**, **pnpm** o **yarn** (gestor de paquetes)

Puedes verificar la instalación de Node.js y npm con los siguientes comandos:
```sh
node -v
npm -v
```


### Variables de Entorno

### Ejecución del proyectpo

#### 📦 Instalación
Clona el repositorio y accede a la carpeta del proyecto:
```sh
git clone https://github.com/udistrital/observatorios_cliente.git
cd observatorios_cliente
```

Instala las dependencias del proyecto:
```sh
npm install
```

#### 🚀 Ejecutar el proyecto en modo desarrollo
Para iniciar el servidor de desarrollo, usa el siguiente comando:
```sh
npm run dev
```
Esto iniciará el proyecto y podrás verlo en tu navegador en:
```
http://localhost:5173/
```

#### 🏗️ Construcción para producción
Si deseas generar una versión optimizada del proyecto para producción, usa:
```sh
npm run build
```
Esto creará una carpeta **`dist/`** con los archivos listos para ser desplegados en un servidor.


## Estado CI

| Develop | Relese 0.0.1 | Master |
| -- | -- | -- |
| -- | -- | -- |

## 📝 Licencia

This file is part of observatorios_cliente.

observatorios_cliente is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

observatorios_cliente is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with novedades_crud. If not, see https://www.gnu.org/licenses/.

