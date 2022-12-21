import { RequestHandler } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const userlogin: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await axios({
      url: "http://localhost:8080/v1/graphql",
      method: "post",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": "Goldtree@9",
      },
      data: {
        query: `query fetchUser($email : String){
                users(where: {email: {_eq: $email}}) {
                  email
                  firstName
                  id
                  lastName
                  password
                }
              }
              `,
        variables: {
          email: email,
        },
      },
    });

    const userDetails = data.data.data.users;

    if (userDetails.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: ReasonPhrases.NOT_FOUND,
        message: "User not registered with the email",
      });
    } else if (password !== userDetails[0].password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: ReasonPhrases.BAD_REQUEST,
        message: "User has incorrect password",
      });
    }

    const token = jwt.sign(
      {
        "https://hasura.io/jwt/claims": {
          "x-hasura-allowed-roles": ["user"],
          "x-hasura-default-role": "user",
          "x-hasura-user-id": userDetails[0].id.toString(),
        },
      },
      jwtSecret
    );

    res.status(StatusCodes.OK).json({
      status: ReasonPhrases.OK,
      message: "User logged in succesfully",
      token,
    });
  } catch (err: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      error: err,
      message: err.message,
    });
  }
};
