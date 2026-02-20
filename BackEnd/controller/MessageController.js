const Message = require("../models/MessageModel");


/* SEND MESSAGE */
exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message, messageType, mediaUrl } = req.body;

    if (!sender || !receiver) {
      return res.status(400).json({ message: "Sender and receiver required" });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      messageType: messageType || "text",
      mediaUrl: mediaUrl || null,
      status: "sent"
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


/* GET CHAT BETWEEN TWO USERS */
exports.getChat = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      isDeleted: false,
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    })
      .populate("sender", "name username email")
      .populate("receiver", "name username email")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* GET ALL USER MESSAGES */
exports.getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      isDeleted: false,
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate("sender", "name username")
      .populate("receiver", "name username")
      .sort({ createdAt: -1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* MARK MESSAGE AS SEEN */
exports.markAsSeen = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(
      messageId,
      { status: "seen" }
    );

    res.json({ message: "Message marked as seen" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* MARK AS DELIVERED */
exports.markAsDelivered = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(
      messageId,
      { status: "delivered" }
    );

    res.json({ message: "Message marked as delivered" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* EDIT MESSAGE */
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message } = req.body;

    await Message.findByIdAndUpdate(
      messageId,
      { message, isEdited: true }
    );

    res.json({ message: "Message edited successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* SOFT DELETE MESSAGE */
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    await Message.findByIdAndUpdate(
      messageId,
      { isDeleted: true }
    );

    res.json({ message: "Message deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};