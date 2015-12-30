# project-manager

a project managing tool based on nodejs and javascript using the local filesystem for saving project details

## Intention
I want to build a management tool build ontop of nodejs and javascript as coding language.
The Idea is to have this tool localy on your desktop and accessible as a nativ application or webpage.
The second Idea is to use your local filesystem to store the project datas and then synchronize them with Dropbox or something comparable.
The stored date should be readble and editable by a simple editor, therefore i chose the JSON fromat.

At the end the application should provide a simple overview of the projects, sortable by tags and a monitor for changes and informatins about the project.

## Technologys
- JavaScript
- Typescript 
- NodeJS

## Todo's
short term
- [x] handle projects as object (or even as a state)
- [x] provide functions to save/load a project to/from filesystem
- [x] settings file for different behavior
- [ ] extract modules from project-manager

longterm
- [ ] build an api on top of the modules
- [ ] creat realtime app
- [ ] build backend
- [ ] build frontend (cockpit)
