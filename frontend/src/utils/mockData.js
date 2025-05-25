export const generateMockUsers = (count = 20) => {
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Tom', 'Lisa', 'Steve', 'Anna', 
    'Robert', 'Mary', 'James', 'Patricia', 'Michael', 'Linda', 'William', 'Elizabeth', 'Daniel', 'Barbara'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 
    'Taylor', 'Moore', 'Jackson', 'Martin'];
  
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      _id: i + 1,
      firstname: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastname: lastNames[Math.floor(Math.random() * lastNames.length)],
      balance: 10000  // Fixed virtual balance for all users
    });
  }
  return users;
};