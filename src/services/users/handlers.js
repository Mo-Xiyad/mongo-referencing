import express from "express";
import UserModel from "../../models/userSchema.js";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";

const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const createUsers = async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const getUsersById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId, {
      __v: 0, //this second parameter is projecting what not to show
    });
    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const updateUsersById = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const deleteUsersById = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const deleteUsersById = await UserModel.findByIdAndDelete(id);
    if (deleteUsersById) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const handler = {
  getUsers,
  createUsers,
  getUsersById,
  updateUsersById,
  deleteUsersById,
};
export default handler;
