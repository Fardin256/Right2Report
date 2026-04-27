const Button = ({ children, type = "button" }) => {
  return (
    <button type={type} className="btn-primary">
      {children}
    </button>
  );
};

export default Button;