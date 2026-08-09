const contextBuilder = ({ user }) => {
  return {
    currentTime: new Date().toISOString(),

    user: {
      id: user.id_user,
      name: user.name,
      role: user.role,
    },
  };
};

export default contextBuilder;
