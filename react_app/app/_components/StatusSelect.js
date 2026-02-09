export default function StatusSelect({name, classNames, value, onChange}){
	
	return <>
	<select name={name} required className={classNames} defaultValue={value} onChange={onChange} >
	  <option value="">No Selection</option>
	  <option value="Not Started">Not Started</option>
	  <option value="In Progress">In Progress</option>
	  <option value="Blocked">Blocked</option>
	  <option value="On Hold">On Hold</option>
	  <option value="Cancelled">Cancelled</option>
	  <option value="Completed">Completed</option>
	</select>
	</>;
}