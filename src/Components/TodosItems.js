import Checkbox from './Checkboxes';

const TodosItem = ({ todo }) => {
  return (
    <div className="container">
      <Checkbox Todo={todo} />
    </div>
  );
};

export default TodosItem;
