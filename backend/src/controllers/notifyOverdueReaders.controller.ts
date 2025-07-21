import { Request, Response, NextFunction } from 'express';
import { LendingModel } from '../models/lending';
import { sendEmail } from '../utils/mailer';
import { APIError } from '../errors/APIError';
import { Reader } from '../models/Reader';
import { Book } from '../models/Book';

export const notifyOverdueReaders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const today = new Date();

        const overdueLendings = await LendingModel.find({
            dueDate: { $lt: today },
            returned: false,
        }).populate('reader').populate('book');

        const grouped: Record<string, { reader: any; books: any[] }> = {};

        overdueLendings.forEach(lending => {
            const reader = lending.reader as Reader;
            const book = lending.book as Book;

            if (!grouped[reader.readerId]) {
                grouped[reader.readerId] = { reader, books: [] };
            }
            grouped[reader.readerId].books.push({
                title: book.title,
                dueDate: lending.dueDate.toDateString(),
            });
        });

        // Send emails
        for (const readerId in grouped) {
            const { reader, books } = grouped[readerId];

            const bookList = books
                .map(book => `• ${book.title} (Due: ${book.dueDate})`)
                .join('\n');

            const message = `Dear ${reader.name},\n\nYou have the following overdue books:\n\n${bookList}\n\nPlease return them as soon as possible.\n\n- Library Management System`;

            await sendEmail(reader.email, 'Overdue Book Notification', message);
        }

        res.status(200).json({ message: 'Email notifications sent successfully.' });
    } catch (error: any) {
        next(new APIError(500, "Failed to send notifications", error.message));
    }
};

export const testmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await sendEmail('sherul.dhanushka@gmail.com', 'Bookclub', 'This is a test mail from Book Club Library System 📚');
    res.status(200).json({ message: 'Test email sent successfully!' });
  } catch (error: any) {
    next(new APIError(500, "Failed to send test email", error.message));
  }
};
