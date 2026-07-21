const { sendSuccess } = require('../utils/apiResponse');
const commentService = require('../services/commentService');

const addComment = async (req, res) => {
  const comment = await commentService.addComment(req.params.ticketId, {
    message: req.body.message,
    userId: req.user.id,
  });
  sendSuccess(res, comment, 201);
};

const getComments = async (req, res) => {
  const comments = await commentService.getComments(req.params.ticketId);
  sendSuccess(res, comments);
};

module.exports = {
  addComment,
  getComments,
};
