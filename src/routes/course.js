const express = require('express')
const {
    createCourse,
    getCourseById,
    getCourses,
    deleteCoursebyId,
    updateCourseById
} = require('../controller/course.js');
const courseRouter = express.Router();

 courseRouter.post('/', createCourse)
courseRouter.get('/', getCourses)
courseRouter.get('/:id', getCourseById)
courseRouter.delete('/:id', deleteCoursebyId)
courseRouter.put('/:id', updateCourseById) 

module.exports = courseRouter