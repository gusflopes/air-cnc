const Booking = require('../models/Booking');


module.exports = {
   async store(req, res) {
      const { booking_id } = req.params;

      const booking = await Booking.findById(booking_id).populate('spot');

      //Apenas o dono pode aprovar;
      //Não permitir alterar depois de alteado uma vez.

      booking.approved = true;

      await booking.save();

      if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit('booking_response', booking);
   }   

      return res.json(booking);
   }
};