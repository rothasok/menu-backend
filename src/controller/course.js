const CourseModel = require('../models/course.js')
const asyncHandler = require('express-async-handler')
const redisClient = require('../redis/index.js')

/**
 * Controller is a specific function to handle specific tasks
 */

const createCourse = asyncHandler(async (req, res) => {
    const course = new CourseModel(req.body)
    const result = await course.save()
    // Invalidate Cache
    // const { baseUrl } = req
    // const keys = await redisClient.keys(`${baseUrl}*`)
    // redisClient.del(keys[0])
    return res.json(result)
})

const getCourseById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const course = await CourseModel.findById(id)
    return res.json(course)
})

const getCourses = asyncHandler(async (req, res) => {
    // // console.log("Hello")
    // // Get all courses 
    // const key = '/courses'
    // // Check if cache exist
    // const result = await redisClient.get(key)
    // // console.log(result)
    // if (!result) {
    //     // Query operation takes time
    //     console.log("Consuming Time")
    //     const courses = await CourseModel.find()
    //     redisClient.set(key, JSON.stringify(courses), {
    //         EX: 30
    //     })
    //     return res.json(courses)
    // }
    // const course = JSON.parse(result)
    // // console.log(result)
    // return res.json(course)

    // Price greater than 100, Little than 300
    const courses = await CourseModel.find({
        price:{
            $gte:100.0,
            $lte:300.0
        }
    })
    return res.json(courses)
})

const deleteCoursebyId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await CourseModel.deleteOne({ _id: id })
    return res.json(result)
})

const updateCourseById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const result = await CourseModel.updateOne({ _id: id }, req.body)
    // const result = await CourseModel.findByIdAndUpdate(id, req.body)
    return res.json(result)
})

module.exports = {
    createCourse,
    getCourseById,
    getCourses,
    deleteCoursebyId,
    updateCourseById
}