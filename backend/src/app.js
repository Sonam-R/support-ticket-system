const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const ticketRoutes = require('./routes/ticketRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const { swaggerServe, swaggerSetup } = require('./config/swagger');

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/docs', swaggerServe, swaggerSetup);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Support Ticket API running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/tickets/:ticketId/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;
