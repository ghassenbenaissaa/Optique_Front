const PageMeta = ({
  title
}) => {
  return <title>
      {title ? `${title} | Optique` : 'Optique'}
    </title>;
};
export default PageMeta;
