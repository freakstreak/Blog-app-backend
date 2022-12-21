import { RequestHandler } from "express";
import axios from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const userSignUp: RequestHandler = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: ReasonPhrases.BAD_REQUEST,
      message: "Please enter all the fields",
    });
  }

  try {
    const data = await axios({
      url: "http://localhost:8080/v1/graphql",
      method: "post",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": "Goldtree@9",
      },
      data: {
        query: `mutation addUser($firstName : String, $lastName: String ,$email : String, $password: String){
              insert_users_one(object: {firstName: $firstName, lastName: $lastName, email: $email, password: $password}) {
                id
                firstName
                lastName
                email
                password
              }
              }
              `,
        variables: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        },
      },
    });

    res.status(StatusCodes.OK).json({
      status: ReasonPhrases.OK,
      message: "User Registered Succesfully",
      data: data.data.data.insert_users_one,
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      error: err,
      message: err.message,
    });
  }
};
