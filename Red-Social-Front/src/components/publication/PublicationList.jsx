import { Link } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import PropTypes from "prop-types";
import ReactTimeAgo from "react-time-ago";

export const PublicationList = ({
  publications,
  setPublications,
  getPublications,
  page,
  setPage,
  more,
  setMore}
) => {

    const { auth } = useAuth();

  const nextPage = () => {
    let next = page + 1;
    setPage(next);
    getPublications(next);
  };

  const deletePublication = async (publicationId) => {
    const request = await fetch(
      Global.url + "publication/remove/" + publicationId,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await request.json();
    console.log(data);

    if (data.status === "success") {
      // Filtra las publicaciones para eliminar la que se eliminó
      setPublications((prevPublications) =>
        prevPublications.filter((pub) => pub._id !== publicationId)
      );
    }

    // Reinicia la página y la lógica de carga de más publicaciones
    setPage(1);
    setMore(true);
  };

  return (
    <>
      <div className="content__posts">
        {publications.map((publication) => {
          return (
            <article
              className="posts__post"
              key={publication._id + Math.random()}
            >
              <div className="post__container">
                <div className="post__image-user">
                  <Link
                    to={"/social/perfil/" + publication.user._id}
                    className="post__image-link"
                  >
                    {publication.user.image !== "default.png" && (
                      <img
                        src={
                          Global.url + "user/avatar/" + publication.user.image
                        }
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {publication.user.image === "default.png" && (
                      <img
                        src={avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <a href="#" className="user-info__name">
                      {publication.user.name}
                    </a>
                    <span className="user-info__divider"> | </span>
                    <a href="#" className="user-info__create-date"><ReactTimeAgo date={publication.created_at} locale="es-ES"/>
                    </a>
                  </div>

                  <h4 className="post__content">{publication.text}</h4>

                  {publication.file && (
                    <img
                      src={Global.url + "publication/media/" + publication.file}
                      alt="Imagen de la publicación"
                    />
                  )}
                </div>
              </div>

              {auth._id == publication.user._id && (
                <div className="post__buttons">
                  <button
                    className="post__button"
                    onClick={() => deletePublication(publication._id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            Ver mas publicaciones
          </button>
        </div>
      )}
    </>
  );
};

PublicationList.propTypes = {
    publications: PropTypes.array.isRequired,
    setPublications: PropTypes.func.isRequired,
    getPublications: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    setPage: PropTypes.func.isRequired,
    more: PropTypes.bool.isRequired,
    setMore: PropTypes.func.isRequired,
  };