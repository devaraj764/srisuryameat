export function formatDate(i: Date): string {
    const today = new Date(Date.now());
    const inputDate = new Date(i)
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (inputDate.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (inputDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else if (inputDate.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const month = monthNames[inputDate.getMonth()];
        const day = inputDate.getDate();
        const year = inputDate.getFullYear();
        return `${month} ${day} ${year}`;
    }
}