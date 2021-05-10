package com.uniovi.tests;

import static org.junit.Assert.assertTrue;

//Paquetes Java
import java.util.List;

//Paquetes JUnit 
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
//Paquetes Selenium 
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

//Paquetes con los Page Object
import com.uniovi.tests.pageobjects.PO_AddOfferView;
import com.uniovi.tests.pageobjects.PO_AdminView;
import com.uniovi.tests.pageobjects.PO_ChatView;
import com.uniovi.tests.pageobjects.PO_LoginView;
import com.uniovi.tests.pageobjects.PO_NavView;
import com.uniovi.tests.pageobjects.PO_PrivateView;
import com.uniovi.tests.pageobjects.PO_RegisterView;
import com.uniovi.tests.pageobjects.PO_View;
//Paquetes Utilidades de Testing Propias
import com.uniovi.tests.util.SeleniumUtils;

//Ordenamos las pruebas por el nombre del método
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class SdiEntrega2Tests {
    // En Windows (Debe ser la versión 65.0.1 y desactivar las actualizacioens
    // automáticas)):
    // static String PathFirefox65 = "C:\\Program Files\\Mozilla
    // Firefox\\firefox.exe";
    // static String Geckdriver024 = "C:\\Path\\geckodriver024win64.exe";
    // En MACOSX (Debe ser la versión 65.0.1 y desactivar las actualizacioens
    // automáticas):
    static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
    // static String PathFirefox64 =
    // "/Applications/Firefox.app/Contents/MacOS/firefox-bin";
    static String Geckdriver024 = "lib\\geckodriver024win64.exe";
    // static String Geckdriver022 =
    // "/Users/delacal/Documents/SDI1718/firefox/geckodriver023mac";
    // Común a Windows y a MACOSX
    static WebDriver driver = getDriver(PathFirefox65, Geckdriver024);
    static String URL = "https://localhost:8081";

    public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
        System.setProperty("webdriver.firefox.bin", PathFirefox);
        System.setProperty("webdriver.gecko.driver", Geckdriver);
        WebDriver driver = new FirefoxDriver();
        return driver;
    }

    // Antes de cada prueba
    @Before
    public void setUp() {
        driver.navigate().to(URL);
    }

    // Después de cada prueba
    @After
    public void tearDown() {
        driver.manage().deleteAllCookies();
    }

    // Configuramos las pruebas.
    @BeforeClass
    static public void begin() {
        // Fijamos el timeout en cada opción de carga de una vista. 2 segundos.
        PO_View.setTimeout(3);

        // reseteo de la base de datos
        driver.navigate().to(URL + "/test");
        PO_View.checkElement(driver, "text", "Cargando datos en MongoDB...");

    }

    @AfterClass
    static public void end() {
        // Cerramos el navegador al finalizar las pruebas
        driver.quit();
    }

    // PR01. Registro de Usuario con datos válidos.
    @Test
    public void PR01() {
        // registro e inicio de sesión
        PO_RegisterView.signup(driver, "test1@test.com", "Prueba", "Test1",
                "12345678", "12345678");
        // elemento unico de la vista /home de usuario
        PO_View.checkElement(driver, "text", "Ofertas");
    }

    // PR02. Registro de Usuario con datos inválidos (email, nombre y apellidos
    // vacíos).
    @Test
    public void PR02() {
        // registro inválido
        PO_RegisterView.signup(driver, "", "", "", "12345678", "12345678");
        PO_View.alerta(driver, "Los campos no pueden estar vacíos");

    }

    // PR03. Registro de Usuario con datos inválidos (repetición de contraseña
    // inválida).
    @Test
    public void PR03() {
        // registro inválido
        PO_RegisterView.signup(driver, "test3@test.com", "Prueba", "Test2",
                "12345678", "1234567890");
        PO_View.alerta(driver, "Las contraseñas deben coincidir");
    }

    // PR04. Registro de Usuario con datos inválidos (email existente).
    @Test
    public void PR04() {
        // registro inválido
        PO_RegisterView.signup(driver, "test4@email.com", "Prueba", "Test4",
                "12345678", "12345678");
        PO_View.alerta(driver, "Ya existe un usuario con ese email");
    }

    // PR05. Inicio de sesión con datos válidos.
    @Test
    public void PR05() {
        // inicio correcto
        PO_LoginView.login(driver, "admin@email.com", "admin");
        // aparece la pagina principal de administrador
        PO_View.checkElement(driver, "id", "admin");
    }

    // PR06. Inicio de sesión con datos inválidos (email existente,pero
    // contraseña incorrecta).
    @Test
    public void PR06() {
        // inicio incorrecto
        PO_LoginView.login(driver, "test2@email.com", "admin");
        PO_View.alerta(driver, "Email o password incorrecto");
    }

    // PR07. Inicio de sesión con datos inválidos (campo email o contraseña
    // vacíos).
    @Test
    public void PR07() {
        // inicio incorrecto
        PO_LoginView.login(driver, "", "admin");
        PO_View.alerta(driver, "Los campos no pueden estar vacíos");
        // contraseña vacia prueba 42
    }

    // PR08. Inicio de sesión con datos inválidos (email no existente en la
    // aplicación).
    @Test
    public void PR08() {
        // inicio incorrecto
        PO_LoginView.login(driver, "email@inexistente.com", "12345678");
        PO_View.alerta(driver, "Email o password incorrecto");
    }

    // PR09. Hacer click en la opción de salir de sesión y comprobar que se
    // redirige a la página de inicio de sesión(Login).
    @Test
    public void PR09() {
        // inicio correcto
        PO_LoginView.login(driver, "test1@email.com", "12345678");
        // muestra página principal de usuario
        PO_View.checkElement(driver, "text", "Ofertas");
        // desconexión
        PO_NavView.clickOption(driver, "desconectarse", "id",
                "identificacion-titulo");
        // vuelve al formulario de inicio de sesión
        PO_View.checkElement(driver, "text", "Identificación de usuario");
    }

    // PR10. Comprobarque el botón cerrar sesión no está visible si el usuario
    // no está autenticado.
    @Test
    public void PR10() {
        // inicio correcto
        PO_LoginView.login(driver, "test1@email.com", "12345678");
        // muestra página principal de usuario con el botón de desconectarse
        PO_View.checkElement(driver, "text", "Ofertas");
        List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver,
                "@href", "desconectarse", 1);
        assertTrue(elementos.size() == 1);
        // desconexión
        PO_NavView.clickOption(driver, "desconectarse", "id",
                "identificacion-titulo");
        // el boton de desconexión ya no está visible
        PO_View.checkElement(driver, "text", "Identifícate");
        // no se ve el de cerrar sesión
        SeleniumUtils.textoNoPresentePagina(driver, "Cierra sesión");
    }

    // PR11. Mostrar el listado de usuarios y comprobar que se muestran todos
    // los que existen en el sistema.
    @Test
    public void PR11() {
        // login admin
        PO_LoginView.loginAdmin(driver);
        // se muestran todos los usuarios de la base de pruebas
        PO_View.checkElement(driver, "text", "test1@email.com");
        PO_View.checkElement(driver, "text", "test2@email.com");
        PO_View.checkElement(driver, "text", "test3@email.com");
        PO_View.checkElement(driver, "text", "test4@email.com");
        PO_View.checkElement(driver, "text", "test5@email.com");
        PO_View.checkElement(driver, "text", "test6@email.com");
        PO_View.checkElement(driver, "text", "test7@email.com");
        // y el usuario creado en los test anteriores
        PO_View.checkElement(driver, "text", "test1@test.com");
    }

    // PR12. Ir a la lista de usuarios,borrar el primer usuario de la
    // lista, comprobar que la lista se actualiza y dicho usuario desaparece.
    @Test
    public void PR12() {
        // login admin
        PO_LoginView.loginAdmin(driver);
        // click en el primer checkbox y lo borramos
        PO_AdminView.borrarCheckBox(driver, "cbtest1@email.com");
        // comprobamos que ya no está en la bbdd
        PO_AdminView.checkUsuarioEliminado(driver, "test1@email.com");

    }

    // PR13. Ir a la lista de usuarios,borrar el último usuario de la lista,
    // comprobar que la lista se actualizay dicho usuario desaparece.
    @Test
    public void PR13() {
        // login admin
        PO_LoginView.loginAdmin(driver);
        // click en el último checkbox y lo borramos
        PO_AdminView.borrarCheckBox(driver, "cbtest1@test.com");
        // comprobamos que ya no está en la bbdd ->desconexión
        PO_AdminView.checkUsuarioEliminado(driver, "test1@test.com");

    }

    // PR14. Ir a la lista deusuarios,borrar 3 usuarios, comprobar que la lista
    // se actualiza y dichos usuarios desaparecen.
    @Test
    public void PR14() {
        // login admin
        PO_LoginView.loginAdmin(driver);
        // seleccionamos 3 usuarios
        PO_View.checkElement(driver, "id", "cbtest2@email.com");
        driver.findElement(By.id("cbtest2@email.com")).click();
        PO_View.checkElement(driver, "id", "cbtest3@email.com");
        driver.findElement(By.id("cbtest3@email.com")).click();
        PO_View.checkElement(driver, "id", "cbtest4@email.com");
        driver.findElement(By.id("cbtest4@email.com")).click();
        // se borra
        PO_View.checkElement(driver, "id", "btnDelete");
        driver.findElement(By.id("btnDelete")).click();

        SeleniumUtils.textoNoPresentePagina(driver, "test2@email.com");
        SeleniumUtils.textoNoPresentePagina(driver, "test3@email.com");
        SeleniumUtils.textoNoPresentePagina(driver, "test4@email.com");
        // comprobamos que ya no está en la bbdd ->desconexión
        PO_AdminView.checkUsuarioEliminado(driver, "test2@email.com");
        PO_LoginView.loginIncorrecto(driver, "test3@email.com");
        PO_LoginView.loginIncorrecto(driver, "test4@email.com");

    }

    // PR15. Ir al formulario de alta de oferta, rellenarla con datos válidos y
    // pulsar el botón Submit. Comprobar que la oferta sale en el listado de
    // ofertas de dicho usuario.
    @Test
    public void PR15() {
        // inicio correcto y acceso al menu de agregar oferta
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "add");
        // lo rellenamos con datos válidos
        PO_AddOfferView.fillForm(driver, "Mi producto de prueba #1",
                "Esta es una decripción de prueba", "15.43", false);
        // comprobamos que aparecen en la lista
        PO_View.checkElement(driver, "text", "Mi producto de prueba #1");
        // pagina mis ofertas
        PO_View.checkElement(driver, "id", "mis-ofertas");
    }

    // PR16. Ir al formulario dealta de oferta, rellenarla con datos inválidos
    // (campo título vacío y precio en negativo) y pulsar el botón Submit.
    // Comprobar que se muestra el mensaje de campo obligatorio.
    @Test
    public void PR16() {
        // inicio correcto y acceso al menu de agregar oferta
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "add");
        // lo rellenamos con datos inválidos
        PO_AddOfferView.fillForm(driver, "", "Esta es una decripción de prueba",
                "-87", false);
        // se muestra el error
        PO_View.alerta(driver, "Los campos no pueden estar vacíos");
    }

    // PR017. Mostrar el listado de ofertas para dicho usuario y comprobar que
    // se muestran todas las que existen para este usuario
    @Test
    public void PR17() {
        // inicio correcto y acceso al menu de ofertas propias
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "my-product");
        // comprobamos que aparecen en la lista los de la BBDD
        PO_View.checkElement(driver, "text", "Iphone 8 64");
        PO_View.checkElement(driver, "text", "Google Home");
        PO_View.checkElement(driver, "text", "Taburete con ruedas");
        PO_View.checkElement(driver, "text", "Producto para test");
        // y el añadido previamente
        PO_View.checkElement(driver, "text", "Mi producto de prueba #1");
        // estamos en la pagina mis ofertas
        PO_View.checkElement(driver, "id", "mis-ofertas");
    }

    // PR18. Ir a la lista de ofertas, borrar la primera oferta de la lista,
    // comprobar que la lista se actualiza y que la oferta desaparece.
    @Test
    public void PR18() {
        // inicio correcto y acceso al menu de ofertas propias
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "my-product");
        // borrar oferta
        PO_PrivateView.borrarOferta(driver, 1, "Iphone 8 64");
        // comprobamos que la primera fila ya no tiene ese producto
        String text = driver
                .findElement(
                        By.xpath("/html/body/div/div/table/tbody/tr[1]/td[1]"))
                .getText();
        assertTrue(!text.equals("Iphone 8 64"));

    }

    // PR19. Ir a la lista de ofertas, borrar la última oferta de la lista,
    // comprobar que la lista se actualiza y que laoferta desaparece.
    @Test(expected = NoSuchElementException.class)
    public void PR19() {
        // inicio correcto y acceso al menu de ofertas propias
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "my-product");
        // borrar oferta
        PO_PrivateView.borrarOferta(driver, 4, "Mi producto de prueba #1");
        // como ya no existe la cuarta fila debe lanzar una excepión
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[4]/td[1]"))
                .getText();

    }

    // P20. Hacer una búsqueda con el campo vacío ycomprobar que se
    // muestra la página que corresponde con el listado de las ofertas
    // existentes en el sistema
    @Test
    public void PR20() {
        // inicio correcto con búsqueda vacía
        PO_LoginView.loginUser5Busqueda(driver, "");
        // como la lista mantiene siempre el mismo orden, podemos comprobarlo
        // por título
        // debemos tener en cuenta que ya no existen las ofertas de los usuarios
        // eliminados
        PO_View.checkElement(driver, "text", "Monitor 27 pulgadas");
        PO_View.checkElement(driver, "text", "TV 43 Pulgadas");
        PO_View.checkElement(driver, "text", "Flexo Ikea");
        PO_View.checkElement(driver, "text", "Pijama");
        PO_View.checkElement(driver, "text", "Patines en linea");
    }

    // PR21. Hacer una búsqueda escribiendo en el campo un texto que no exista y
    // comprobar que se muestrala página que corresponde, con la listade ofertas
    // vacía.
    @Test
    public void PR21() {
        // inicio correcto con búsqueda que no existe
        PO_LoginView.loginUser5Busqueda(driver, "aaeeiioouu");
        // la lista debe estar vacia
        List<WebElement> elementos = driver
                .findElements(By.xpath("//table/tbody/td"));
        assertTrue(elementos.size() == 0);

    }

    // PR22. Hacer una búsqueda escribiendo en el campo un texto en minúscula o
    // mayúscula y comprobar que se muestra la página que corresponde, con la
    // lista de ofertas que contengan dicho texto, independientemente que el
    // título esté almacenado en minúsculas o mayúscula.
    @Test
    public void PR22() {
        // inicio correcto con búsqueda pulgadas/Pulgadas
        PO_LoginView.loginUser5Busqueda(driver, "pulgadas");
        // comprobamos que salen ambos resultados
        PO_View.checkElement(driver, "text", "Monitor 27 pulgadas");
        PO_View.checkElement(driver, "text", "TV 43 Pulgadas");
    }

    // PR23. Sobre una búsqueda determinada (a elección de desarrollador),
    // comprar una oferta que deja un saldo positivo en el contador del
    // comprobador.
    // Y comprobar que el contador se actualiza correctamente en la vista del
    // comprador
    @Test
    public void PR23() {
        // inicio correcto con búsqueda para compra válida
        PO_LoginView.loginUser5Busqueda(driver, "libro");
        // se realiza una compra válida (36.2 -> 28.7)
        // compra valida, substring (antiguo -> nuevo), mensaje, saldo final
        PO_PrivateView.compra(driver, 4, 4, "Oferta comprada", 28.7);

    }

    // PR24. Sobre una búsqueda determinada (a elección de desarrollador),
    // comprar una oferta que deja un saldo 0 en el contador del comprobador. Y
    // comprobar que el contador se actualiza correctamente en la vista del
    // comprador.
    @Test
    public void PR24() {
        // inicio correcto con búsqueda para compra precio justo
        PO_LoginView.loginUser5Busqueda(driver, "precio justo");
        // compra valida, substring 4, mensaje, saldo final;
        PO_PrivateView.compra(driver, 4, 2, "Oferta comprada", 0);
    }

    // PR25. Sobre una búsqueda determinada (a elección de desarrollador),
    // intentar comprar una oferta que esté por encima de saldo disponible del
    // comprador.
    // Y comprobar que semuestra el mensaje de saldo no suficiente.
    @Test
    public void PR25() {
        // inicio correcto
        PO_LoginView.login(driver, "test6@email.com", "12345678");
        // hacemos una búsqueda vacía
        PO_PrivateView.fillFormSearch(driver, "para test");
        // precio anterior 150.5 -> 150.5
        PO_PrivateView.compra(driver, 5, 5, "Saldo insuficiente."
                + " No se puede comprar la oferta seleccionada", 150.5);

    }

    // PR26. Ir a la opción de ofertas compradas del usuario y mostrar la lista.
    // Comprobar que aparecen las ofertas que deben aparecer.
    @Test
    public void PR26() {
        // inicio correcto
        PO_LoginView.login(driver, "test5@email.com", "12345678");
        // vamos a la ventana de compras
        PO_View.checkElement(driver, "id", "mCompras");
        driver.findElement(By.id("mCompras")).click();
        // comprobamos que aparecen las compras nuevas
        PO_View.checkElement(driver, "id", "table");
        PO_View.checkElement(driver, "text", "Libro 1984");
        PO_View.checkElement(driver, "text", "precio justo");
        // (solo las nuevas, las anteriores desaparecieron al borrar los
        // usuarios)
        SeleniumUtils.textoNoPresentePagina(driver, "TV Samsung");
        SeleniumUtils.textoNoPresentePagina(driver, "Libro El Principito");
        SeleniumUtils.textoNoPresentePagina(driver, "Libros academia C2");
    }

    // PR27. Al crear una oferta marcar dicha oferta como destacada y a
    // continuación comprobar: i) que aparece en el listado de ofertas
    // destacadas para los usuarios y que el saldo del usuario se actualiza
    // adecuadamente en la vista del ofertante (-20).
    @Test
    public void PR27() {
        // inicio correcto y ventana agregar oferta
        PO_LoginView.loginUserMenu(driver, "test6@email.com", "add");
        // lo rellenamos con datos válidos
        PO_AddOfferView.fillForm(driver, "Mi producto destacado",
                "descripción destacada", "5", true);
        PO_View.checkElement(driver, "text", "Mi producto destacado");
        // mensaje y saldo esperado, substring 5
        PO_PrivateView.ofertaDestacada(driver, "Oferta agregada", 5, 130.5);
        // comprobamos que se muestra como destacada para el resto de usuarios
        PO_PrivateView.comprobarDestacados(driver, "Mi producto destacado");

    }

    // PR28. Sobre el listado de ofertas de un usuario con másde 20 euros de
    // saldo, pinchar en el enlace Destacada y a continuación comprobar: i) que
    // aparece en el listadode ofertas destacadas para los usuarios y que el
    // saldo del usuario se actualiza adecuadamente en la vista del ofertante
    // (-20)
    @Test
    public void PR28() {
        // inicio correcto y ventana agregar oferta
        PO_LoginView.loginUserMenu(driver, "test6@email.com", "my-product");
        PO_View.checkElement(driver, "id", "mis-ofertas");
        // destacamos una oferta
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[2]/td[5]/a"))
                .click();
        // mensaje y saldo esperado, substring 5
        PO_PrivateView.ofertaDestacada(driver, "Oferta destacada", 5, 110.5);
        // comprobamos que se muestra como destacada para el resto de usuarios
        PO_PrivateView.comprobarDestacados(driver, "Mi producto destacado");
    }

    // PR029. Sobre el listado de ofertas de un usuario con menos de 20 euros de
    // saldo, pinchar en el enlace Destacada y a continuación comprobar que se
    // muestra el mensaje de saldo no suficiente.
    @Test
    public void PR29() {
        // inicio correcto y ventana agregar oferta
        PO_LoginView.loginUserMenu(driver, "test5@email.com", "my-product");
        PO_View.checkElement(driver, "id", "mis-ofertas");
        // destacamos una oferta
        driver.findElement(
                By.xpath("/html/body/div/div/table/tbody/tr[1]/td[5]/a"))
                .click();
        // mensaje y saldo esperado
        PO_PrivateView.ofertaDestacada(driver,
                "No tienes dinero suficiente para destacar una oferta (20€) ",
                1, 0);
    }

    // PR030. Inicio de sesión con datos válidos.
    @Test
    public void PR30() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL);
    }

    // PR031. Inicio de sesión con datos inválidos (email existente, pero
    // contraseña incorrecta).
    @Test
    public void PR31() {
        PO_LoginView.loginAPIincorrecto(driver, URL, "test6@email.com",
                "00000000000");
    }

    // PR032. Inicio de sesión con datos inválidos (campo email o contraseña
    // vacíos).
    @Test
    public void PR32() {
        PO_LoginView.loginAPIincorrecto(driver, URL, "", "12345678");
        // contraseña vacia prueba 41
    }

    // PR033. Mostrar el listadode ofertas disponibles y comprobar que se
    // muestran todas las que existen, menos las del usuario identificado.
    @Test
    public void PR33() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL);
        // no sale ninguna del usuario actual
        SeleniumUtils.textoNoPresentePagina(driver, "test6@email.com");
        // muestra el resto de ofertas disponibles (test5 y test7)
        PO_View.checkElement(driver, "text", "Google Home");
        PO_View.checkElement(driver, "text", "Taburete con ruedas");
        PO_View.checkElement(driver, "text", "Producto para test");
        PO_View.checkElement(driver, "text", "Pijama");
        PO_View.checkElement(driver, "text", "Patines en linea");
        PO_View.checkElement(driver, "text", "Libro 1984");
        PO_View.checkElement(driver, "text", "precio justo");
    }

    // PR034. Sobre una búsqueda determinada de ofertas (a elección de
    // desarrollador), enviar un mensaje a una oferta concreta. Se abriría dicha
    // conversación por primera vez. Comprobar que el mensaje aparece en el
    // listado de mensajes
    @Test
    public void PR34() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL);
        // pulsamos en la primera oferta para ir a su chat
        PO_ChatView.primerChat(driver);
        // comprobamos que el chat está vacío
        PO_View.checkElement(driver, "id", "alertas");
        // muestra el mensaje de error adecuado
        PO_View.checkElement(driver, "text",
                "El chat está vacío.Envía un mensaje para comenzar la conversación");
        // insertamos un mensaje
        PO_ChatView.fillForm(driver, "no crees que es un poco caro?");
        // comprobamos que se muestra
        PO_View.checkElement(driver, "id", "chat");
    }

    // PR035. Sobre el listado de conversaciones enviar un mensaje a una
    // conversación ya abierta. Comprobar que el mensaje aparece en el listado
    // de mensajes.
    @Test
    public void PR35() {
        // inicio API user6
        PO_LoginView.loginAPI(driver, URL);
        // pulsamos en la primera oferta para ir a su chat
        PO_ChatView.primerChat(driver);
        // comprobamos que el chat no está vacío
        PO_View.checkElement(driver, "id", "chat");
        // insertamos un mensaje
        PO_ChatView.fillForm(driver, "como mucho te doy 400");
        // comprobamos que se muestra
        PO_View.checkElement(driver, "text", "como mucho te doy 400");
        // y ahora hay 2 mensajes en el chat
        List<WebElement> elementos = driver
                .findElements(By.xpath("//*[@id='chat']/div"));
        assertTrue(elementos.size() == 2);

    }

    // PR036. Mostrar el listado de conversaciones ya abiertas. Comprobar que el
    // listado contiene las conversaciones que deben ser.
    @Test
    public void PR36() {

    }

    // PR037. Sobre el listado de conversaciones ya abiertas. Pinchar el enlace
    // Eliminar de la primera y comprobar queel listado se actualiza
    // correctamente
    @Test
    public void PR37() {

    }

    // PR036. Sobre el listado de conversaciones ya abiertas. Pinchar el enlace
    // Eliminar de la última y comprobar que el listado se actualiza
    // correctamente.
    @Test
    public void PR38() {

    }

    // PR039. Identificarse en la aplicación y enviar un mensaje a una oferta,
    // validar que el mensaje enviado aparece en el chat. Identificarse después
    // con el usuario propietario de la oferta y validar que tiene un mensaje
    // sin leer, entrar en el chaty comprobar que el mensaje pasa a tener el
    // estado leído.
    @Test
    public void PR39() {

    }

    // PR036. Identificarse en la aplicación y enviar tresmensajes a una oferta,
    // validar que los mensajes enviados aparecen en el chat. Identificarse
    // después con el usuario propietario de la oferta y validar que el número
    // de mensajes sin leer aparece en suoferta.
    @Test
    public void PR40() {

    }

    // ~~~~~~~~~~~~~~~~~~~~~ AUXILIARES

    // PR041. Inicio de sesión con datos inválidos (contraseña vacía).
    @Test
    public void PR41() {
        PO_LoginView.loginAPIincorrecto(driver, URL, "test@email.com", "");
    }

    // PR07. Inicio de sesión con datos inválidos (contraseña vacíos).
    @Test
    public void PR42() {
        // inicio incorrecto
        PO_LoginView.login(driver, "test1@email.com", "");
        PO_View.alerta(driver, "Los campos no pueden estar vacíos");
    }

}
