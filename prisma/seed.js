const path = require('path');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function clearExistingData() {
  await prisma.ticketHistory.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await clearExistingData();

  const admin = await prisma.user.create({
    data: {
      name: 'William Carter',
      email: 'william.carter@supportdesk.com',
      role: 'ADMIN',
    },
  });

  const emma = await prisma.user.create({
    data: {
      name: 'Emma Johnson',
      email: 'emma.johnson@supportdesk.com',
      role: 'SUPPORT_AGENT',
    },
  });

  const michael = await prisma.user.create({
    data: {
      name: 'Michael Brown',
      email: 'michael.brown@supportdesk.com',
      role: 'SUPPORT_AGENT',
    },
  });

  const david = await prisma.user.create({
    data: {
      name: 'David Miller',
      email: 'david.miller@supportdesk.com',
      role: 'SUPPORT_AGENT',
    },
  });

  const olivia = await prisma.user.create({
    data: {
      name: 'Olivia Davis',
      email: 'olivia.davis@example.com',
      role: 'VIEWER',
    },
  });

  const james = await prisma.user.create({
    data: {
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      role: 'VIEWER',
    },
  });

  const sophia = await prisma.user.create({
    data: {
      name: 'Sophia Martinez',
      email: 'sophia.martinez@example.com',
      role: 'VIEWER',
    },
  });

  const william = await prisma.user.create({
    data: {
      name: 'William Wilson',
      email: 'william.wilson@example.com',
      role: 'VIEWER',
    },
  });

  const ticket1 = await prisma.ticket.create({
    data: {
      title: 'Unable to reset account password',
      description:
        'Customer cannot complete the password reset flow. The reset email arrives but the link expires immediately.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      category: 'ACCOUNT',
      createdById: olivia.id,
      assignedToId: emma.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: 'Payment transaction failed',
      description:
        'Credit card payment was declined during checkout despite sufficient funds.',
      status: 'OPEN',
      priority: 'URGENT',
      category: 'BILLING',
      createdById: james.id,
      assignedToId: michael.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      title: 'Dashboard loading slowly',
      description:
        'Analytics dashboard takes over 30 seconds to load for accounts with large datasets.',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      category: 'TECHNICAL',
      createdById: sophia.id,
      assignedToId: david.id,
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      title: 'Account information update request',
      description:
        'Customer needs to update billing address and company name on their account profile.',
      status: 'CLOSED',
      priority: 'LOW',
      category: 'ACCOUNT',
      createdById: william.id,
      assignedToId: emma.id,
    },
  });

  const ticket5 = await prisma.ticket.create({
    data: {
      title: 'Mobile application crashes after update',
      description:
        'iOS app crashes on launch after installing version 3.2.1. Android appears unaffected.',
      status: 'OPEN',
      priority: 'HIGH',
      category: 'TECHNICAL',
      createdById: olivia.id,
      assignedToId: david.id,
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        message: 'I am facing this issue since yesterday.',
        ticketId: ticket1.id,
        userId: olivia.id,
      },
      {
        message:
          'We are investigating the problem and will update you shortly.',
        ticketId: ticket1.id,
        userId: emma.id,
      },
      {
        message: 'The payment failed twice with different cards.',
        ticketId: ticket2.id,
        userId: james.id,
      },
      {
        message:
          'We are investigating the problem and will update you shortly.',
        ticketId: ticket2.id,
        userId: michael.id,
      },
      {
        message: 'Dashboard performance has been unusable all week.',
        ticketId: ticket3.id,
        userId: sophia.id,
      },
      {
        message: 'We deployed a fix. Please confirm if loading times improved.',
        ticketId: ticket3.id,
        userId: david.id,
      },
      {
        message: 'Please update my company name to Wilson Enterprises.',
        ticketId: ticket4.id,
        userId: william.id,
      },
      {
        message: 'The app crashes immediately after the splash screen.',
        ticketId: ticket5.id,
        userId: olivia.id,
      },
      {
        message:
          'We are investigating the problem and will update you shortly.',
        ticketId: ticket5.id,
        userId: david.id,
      },
    ],
  });

  await prisma.attachment.createMany({
    data: [
      {
        fileName: 'payment-error-screenshot.png',
        fileUrl: '/uploads/payment-error-screenshot.png',
        fileType: 'image/png',
        ticketId: ticket2.id,
      },
      {
        fileName: 'application-crash-log.txt',
        fileUrl: '/uploads/application-crash-log.txt',
        fileType: 'text/plain',
        ticketId: ticket5.id,
      },
      {
        fileName: 'password-reset-error.png',
        fileUrl: '/uploads/password-reset-error.png',
        fileType: 'image/png',
        ticketId: ticket1.id,
      },
    ],
  });

  await prisma.ticketHistory.createMany({
    data: [
      {
        ticketId: ticket1.id,
        action: 'STATUS_CHANGED',
        field: 'status',
        oldValue: 'OPEN',
        newValue: 'IN_PROGRESS',
        performedById: emma.id,
      },
      {
        ticketId: ticket1.id,
        action: 'ASSIGNED',
        field: 'assignedTo',
        oldValue: null,
        newValue: 'Emma Johnson',
        performedById: emma.id,
      },
      {
        ticketId: ticket2.id,
        action: 'ASSIGNED',
        field: 'assignedTo',
        oldValue: null,
        newValue: 'Michael Brown',
        performedById: michael.id,
      },
      {
        ticketId: ticket2.id,
        action: 'PRIORITY_CHANGED',
        field: 'priority',
        oldValue: 'HIGH',
        newValue: 'URGENT',
        performedById: michael.id,
      },
      {
        ticketId: ticket3.id,
        action: 'STATUS_CHANGED',
        field: 'status',
        oldValue: 'IN_PROGRESS',
        newValue: 'RESOLVED',
        performedById: david.id,
      },
      {
        ticketId: ticket3.id,
        action: 'ASSIGNED',
        field: 'assignedTo',
        oldValue: null,
        newValue: 'David Miller',
        performedById: david.id,
      },
      {
        ticketId: ticket4.id,
        action: 'STATUS_CHANGED',
        field: 'status',
        oldValue: 'OPEN',
        newValue: 'CLOSED',
        performedById: emma.id,
      },
      {
        ticketId: ticket5.id,
        action: 'ASSIGNED',
        field: 'assignedTo',
        oldValue: null,
        newValue: 'David Miller',
        performedById: david.id,
      },
    ],
  });

  console.log('Seed completed successfully.');
  console.log({
    users: 8,
    tickets: 5,
    admin: admin.email,
  });
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
