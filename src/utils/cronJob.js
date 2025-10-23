const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const conncectionRequest = require("../models/connectionRequest");
const { se } = require("date-fns/locale");
const sendEmail = require("./sendEmail");

cron.schedule("0 0 * * *", async () => {
    try{
        const yesterday = subDays(new Date(), 1);
        const yesterDaystart = startOfDay(yesterday);
        const yesterDayEnd = endOfDay(yesterday);
        const pendingRequests = conncectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterDaystart,
                $lte: yesterDayEnd,
            },
        }).populate("fromUserId toUserId");

        const listOfEmails = [... new Set(
            pendingRequests.map((request) => request.toUserId.email)
        )]; 


        for(const email of listOfEmails){
            try{
                    const res = await sendEmail.run({
                        to: email,
                        subject: "Pending Connection Requests",
                    });
                    console.log(`Email sent to ${email}:`, res);
            }catch(error){
                console.error(`Error sending email to ${email}:`, error);
            }
        }
        

    } catch(error){
        console.error("Error executing scheduled task:", error);
    }
});