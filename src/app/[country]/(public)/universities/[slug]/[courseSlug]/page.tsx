
const CourseDetailsPage = async(params: {params: Promise<{ courseSlug: string }>}) => {
  return (
    <div>
        { ((await params.params).courseSlug)}
    </div>
  );
};

export default CourseDetailsPage;