// MongoDB connection function
async function connectDB() {
    // your existing connection code here
}


// THIS IS THE TEST ROUTE
app.get("/api/test-db", async (req, res) => {
    try {
        await connectDB();

        return res.status(200).json({
            success: true,
            message: "MongoDB connection is working.",
            database: mongoose.connection.name
        });

    } catch (error) {
        console.error("MONGODB TEST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "MongoDB connection failed.",
            error: error.message,
            name: error.name
        });
    }
});
