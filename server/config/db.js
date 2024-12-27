/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose"
import colors from 'colors'

const conneDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to mongodb database ${conn.connection.host}`.bgBrightGreen
            .brightWhite);
    } catch (error) {
        console.log(`Error in mongoDB ${error}`.bgRed.white);
    }
};

export default conneDB;