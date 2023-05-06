import mongoose from "mongoose";
mongoose.set("strictQuery", true);

const URI = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_TOKEN}@bot-data.7iantuj.mongodb.net/?retryWrites=true&w=majority`;

export default async () =>
    mongoose
        .connect(URI)
        .then((c) => (console.log("Database connection successful!"), c));
