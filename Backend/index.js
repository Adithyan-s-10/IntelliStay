require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleRegisterModel = require("./models/GooglesignModel");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const RegisterModel=require("./models/RegisterModel");
const cookieParser=require("cookie-parser");
const bodyParser=require("body-parser");
const jwt=require("jsonwebtoken");
const RoomModel = require("./models/RoomModel");
const ReservationModel = require("./models/ReservationModel");
const StaffModel = require("./models/StaffModel");
const crypto = require('crypto');
const HousekeepingJobModel=require("./models/HousekeepingJobModel")

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true // Allows cookies to be sent with the request
}));


mongoose.connect("mongodb://127.0.0.1:27017/test2");


// Setup session
var MemoryStore =session.MemoryStore;
app.use(session({
    secret: "secretintelli01",
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore(),
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        sameSite: 'None',
        maxAge:1000*60*60*24
    },
}));

// Setup passport
app.post("/authWithGoogle",async (req,res)=>{
    
        const {name,  email, password, images} = req.body;
        
    
        try{
            const existingUser = await GoogleRegisterModel.findOne({ email: email });       
    
            if(!existingUser){
                const result = await GoogleRegisterModel.create({
                    displayName:name,
                    email:email,
                    password:password,
                    image:images,
                
                });
    
        
                const token = jwt.sign({email:result.email, id: result._id}, process.env.JWT_SECRET_KEY);
    
                return res.status(200).send({
                     user:result,
                     token:token,
                     msg:"User Login Successfully!"
                 })
        
            }
    
            else{
                const existingUser = await GoogleRegisterModel.findOne({ email: email });
                const token = jwt.sign({email:existingUser.email, id: existingUser._id}, process.env.JWT_SECRET_KEY);
    
                return res.status(200).send({
                     user:existingUser,
                     token:token,
                     msg:"User Login Successfully!"
                 })
            }
          
        }catch(error){
            console.log(error)
        }
    
});

 app.post("/logout", (req, res) => {
    if(req.session){
        req.session.destroy(err=>{
            if(err){
            res.status(500).json({error:"failed to logout"});
            }else{
                res.status(200).json("logout successful");
            }
        })
    }
    else{
        res.status(400).json({error:"no session found"});
    }

});


app.post('/login', (req, res) => {
    const { emailsign, passwordsign } = req.body;
    GoogleRegisterModel.findOne({ email: emailsign })
        .then(user => {
            if (user) {
                if (user.password === passwordsign) {
                  
                    req.session.email =  emailsign ;
                    res.status(200).json({message:"success",data: req.session.email,id:user._id});
                    
                } else {
                    res.json("the password is incorrect");
                }
            } else {
                res.json("No user found :(");
            }
        })
        .catch(err => res.json(err));
});

app.post('/Adminlogin', (req, res) => {
    const { emailsign, passwordsign } = req.body;
   
            if (emailsign==='admin@gmail.com' ) {
                if (passwordsign==='Admin123@') {
                  
                    const token = jwt.sign({email:'admin@gmail.com'}, process.env.JWT_SECRET_KEY);
                    res.status(200).json({message:"success",token: token});
                    
                } else {
                    res.json("the password is incorrect");
                }
            } else {
                res.json("No user found :(");
            }
        
        
});



app.get('/profile', (req, res) => {
    console.log(req.user);
    if (req.user) {
        
        res.status(200).json( req.user.email);
    } 
    else {
      res.status(401).json({ message: 'Not logged in' });
    }
  });

app.post('/register', async(req, res) => {
    const{email,password}=req.body;
    try {
        let user = await GoogleRegisterModel.findOne({ email: email });
        if (!user) {
            user = new GoogleRegisterModel({
               
                email: email ,
                password: password,
            });
            await user.save();
             // Save the new user to the database
        }
        return res.json("exists");
    } catch (error) {
        return done(error, null);
    }
});






app.post('/addroom', async(req, res) => {
    const{roomno,roomtype,status,rate,description}=req.body;
    try {
        let room = await RoomModel.findOne({ roomno: roomno });
        if (!room) {
            room = new RoomModel({
               
                roomno: roomno ,
                roomtype: roomtype,
                status:status,
                rate:rate,
                description:description,
            });
            await room.save();
            return res.status(200).json("added"); // Save the new user to the database
        }
        else{
        return res.json("exists");
        }
    } catch (error) {
        return res.json(error, null);
    }
});

app.post('/roomdetails', async (req, res) => {
    try {
        let rooms = await RoomModel.find();
        
        if (rooms && rooms.length > 0) {
            
            return res.status(200).json(rooms); // sending room details
        } else {
            return res.status(404).json({ message: "No rooms are available" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message }); // handle errors properly
    }
});

app.post('/handleMaintenance', async (req, res) => {
    try {
        // Ensure you extract the ID properly from the request body
        const { id } = req.body;

        if (!id) {
            return res.status(400).json("Room ID is required.");
        }

        // Update the room status to "maintenance"
        const result = await RoomModel.updateOne(
            { _id: id }, 
            { $set: { status: "maintenance" } }
        );

        // Check if any documents were modified
        if (result.nModified === 0) {
            return res.status(404).json("Room not found or status already set to maintenance.");
        }

        return res.status(200).json("Room status updated successfully.");
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message }); // handle errors properly
    }
});


app.post('/handleAvailable', async (req, res) => {
    try {
        // Ensure you extract the ID properly from the request body
        const { id } = req.body;

        if (!id) {
            return res.status(400).json("Room ID is required.");
        }

        // Update the room status to "maintenance"
        const result = await RoomModel.updateOne(
            { _id: id }, 
            { $set: { status: "available" } }
        );

        // Check if any documents were modified
        if (result.nModified === 0) {
            return res.status(404).json("Room not found or status already set to available.");
        }

        return res.status(200).json("Room status updated successfully.");
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message }); // handle errors properly
    }
});


const booking=() => {
    
    try {
            let reservation = new ReservationModel({
                user_id:"1212",
                room_id: "66d18e0c66d97da49543b32d" ,
                check_in: "2024-08-29",
                check_out:"2024-08-30",
                booking_date:"2024-08-24",
                status:"reserved",
                total_amount:5500,
                
            });
            reservation.save();
            console.log("added"); // Save the new user to the database
        }
       
     catch (error) {
        console.log(error); 
    }
};
// booking();


app.post('/resdetails', async (req, res) => {
    try {
        let reservation = await ReservationModel.find();
        
        if (reservation && reservation.length > 0) {
            
            return res.status(200).json(reservation); // sending room details
        } else {
            return res.status(404).json({ message: "No rooms reserved" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message }); // handle errors properly
    }
});


app.post('/handleCancellation', async (req, res) => {
    try {
        // Ensure you extract the ID properly from the request body
        const { id } = req.body;

        if (!id) {
            return res.status(400).json("Reservation ID is required.");
        }

        // Update the room status to "maintenance"
        const result = await ReservationModel.updateOne(
            { _id: id }, 
            { $set: { status: "cancelled" } }
        );

        // Check if any documents were modified
        if (result.nModified === 0) {
            return res.status(404).json("Booking not found or status already set to cancelled.");
        }

        return res.status(200).json("Reservation Cancelled successfully.");
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message }); // handle errors properly
    }
});


app.post('/staffregister', async (req, res) => {
    const { email, displayName, phone_no, role, address, dob, salary } = req.body;
    try {
        // const dobDate = new Date(dob);
        // const dobString = `${dobDate.getFullYear()}-${String(dobDate.getMonth() + 1).padStart(2, '0')}-${String(dobDate.getDate()).padStart(2, '0')}`;
        let staff = await StaffModel.findOne({ email: email });
        if (!staff) {
            // Generate a unique password
            const password = crypto.randomBytes(8).toString('hex'); // 16-character password

            staff = new StaffModel({
                displayName: displayName,
                phone_no: phone_no,
                role: role,
                address: address,
                dob: dob,
                salary: salary,
                email: email,
                password: password, // Use the generated password
            });

            await staff.save();
            return res.status(200).json({ message: "Staff registered successfully"});
        } else {
            
            return res.json("exists");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});

app.post('/staffdetails', async (req, res) => {
    try {
        
        let staff = await StaffModel.find().select('-password');
        
        if (staff && staff.length > 0) {
            return res.status(200).json(staff); 
        } else {
            return res.status(404).json({ message: "No staffs are added" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message }); 
    }
});

const assignHousekeepingJobs = async () => {
    try {
        // Fetch all reservations where the checkout date is today
        const today = new Date().setHours(0, 0, 0, 0); // Set to start of the day
        const tomorrow = new Date().setHours(24, 0, 0, 0); // Set to start of the next day

        const reservations = await ReservationModel.find({
            check_out: {
                $gte: today,
                $lt: tomorrow,
            },
            status: "reserved",
        });

        for (const reservation of reservations) {
            // Find an available housekeeping staff
            const availableStaff = await StaffModel.findOne({ role: "housekeeping", availability: true });

            if (availableStaff) {
                // Assign the job to the housekeeping staff
                const housekeepingJob = new HousekeepingJobModel({
                    room_id: reservation.room_id.toString(),
                    task_description: "Room cleaning after checkout",
                    task_date: new Date(),
                    status: "assigned",
                    staff_id: availableStaff._id.toString(),
                });

                await housekeepingJob.save();

                // Update the room status to "cleaning assigned"
                await RoomModel.updateOne(
                    { _id: reservation.room_id },
                    { status: "cleaning assigned" }
                );

                console.log(`Job assigned to ${availableStaff.displayName} for room ${reservation.room_id}`);
            } else {
                console.log("No available housekeeping staff for this reservation.");
            }
        }
    } catch (error) {
        console.error("Error assigning housekeeping jobs:", error);
    }

};

// Call the function to start the job assignment
//

//assignHousekeepingJobs();


// Schedule the job assignment to run automatically based on the reservation table's checkout date and time
const scheduleJobAssignment = () => {
    const currentDate = new Date();
    const targetTime = new Date().setHours(10, 55, 0, 0);

    if (currentDate >= targetTime) {
        assignHousekeepingJobs();
    } else {
        const delay = targetTime - currentDate;
        setTimeout(assignHousekeepingJobs, delay);
    }
};

// Call the function to start the job assignment schedule
// scheduleJobAssignment();



app.post('/asjobdetails', async (req, res) => {
    try {
        
        let jobs = await HousekeepingJobModel.find();
        
        if (jobs && jobs.length > 0) {
            return res.status(200).json(jobs); 
        } else {
            return res.status(404).json({ message: "No jobs are assigned" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message }); 
    }
});


app.post('/updateroom/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        // Find the room by ID and update it
        const updatedRoom = await RoomModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room updated successfully', room: updatedRoom });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/checkrooms', async (req, res) => {
    try {
      const { checkInDate, checkOutDate } = req.body.searchdata;
  
      // Find reserved rooms for the check-in date
      const reservedRooms = await ReservationModel.find({
        check_in: { $eq: new Date(checkInDate) }
       
      }).distinct('room_id');
      console.log(reservedRooms)
  
      // Find available rooms
      const availableRooms = await RoomModel.find({
        _id: { $nin: reservedRooms }
      });
      
      res.status(200).json(availableRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).send("Server Error");
    }
  });


  app.post('/confirmbook', async (req, res) => {
    try {
        const { roomdatas, datas, userid,trateString } = req.body;
         console.log(datas);
         console.log(roomdatas);
        const newReservation = new ReservationModel({
            user_id: userid,
            room_id: roomdatas._id,
            check_in: new Date(datas.checkInDate),
            check_out: new Date(datas.checkOutDate),
            booking_date: new Date(),
            status: 'booked', // Example status
            check_in_time: datas.check_in_time ? new Date() : null,
            check_out_time: datas.check_out_time ? new Date() : null,
            total_amount: trateString,
        });

        await newReservation.save();

        res.status(200).json({ message: 'Booking confirmed', reservation: newReservation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err });
    }
});



app.get('/my-bookings/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
     
      const bookings = await ReservationModel.find({ user_id:userId }); // Adjust this query as needed
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving bookings', error });
    }
  });


app.listen(3001, () => {
    console.log("Server connected");
});


