export const formatDateTime = (dateString) => {
   if (!dateString) {
      return ""
   }
   console.log("formateDateTime function call")
	const inputDate = new Date(dateString);
	const now = new Date();

	const inputDateOnly = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	if (inputDateOnly.getTime() === today.getTime()) {
		const hours = inputDate.getHours();
		const minutes = inputDate.getMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const formattedHour = hours % 12 || 12;
		return `${formattedHour}:${minutes} ${ampm}`;
	} else {
		const day = inputDate.getDate().toString().padStart(2, '0');
		const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
		const year = inputDate.getFullYear().toString().slice(-2);
		return `${day}/${month}/${year}`;
	}
};
