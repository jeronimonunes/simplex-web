#include <emscripten/bind.h>
#include "./simplex/src/Simplex.hh"

using namespace emscripten;

Vector jsFractionArrayToVector(val b)
{
  Vector v(b["length"].as<unsigned int>());
  for (unsigned int i = 0; i < v.size(); i++)
  {
    v[i] = b[i].as<Fraction>();
  }
  return v;
}

Matrix jsFractionArrayArrayToMatrix(val b)
{
  Matrix m;
  unsigned int size = b["length"].as<unsigned int>();
  for (unsigned int i = 0; i < size; i++)
  {
    m.push_back(jsFractionArrayToVector(b[i]));
  }
  return m;
}

val matrixToJs(const Matrix &matrix)
{
  val matrixJs = val::array();
  for (const auto &line : matrix)
  {
    matrixJs.call<void>("push", val::array(line));
  }
  return matrixJs;
}

val tabloidToJs(const Tabloid &tabloid)
{
  val tabloidJs = val::object();
  tabloidJs.set("certificate", val::array(tabloid.certificate));
  tabloidJs.set("certificateMatrix", matrixToJs(tabloid.certificateMatrix));
  tabloidJs.set("A", matrixToJs(tabloid.A));
  tabloidJs.set("B", val::array(tabloid.B));
  tabloidJs.set("C", val::array(tabloid.C));
  tabloidJs.set("v", val::val(tabloid.v));
  return tabloidJs;
}

val simplex(val a, val b, val c)
{
  Matrix A = jsFractionArrayArrayToMatrix(a);
  Vector B = jsFractionArrayToVector(b);
  Vector C = jsFractionArrayToVector(c);
  Tabloid tabloid(A, B, C);
  Result result = runSimplex(tabloid);
  val res = val::object();
  res.set("solution", val::array(result.solution));
  res.set("certificate", val::array(result.certificate));
  res.set("value", result.value);
  switch (result.type)
  {
  case ResultType::ILIMITED:
    res.set("type", "ILIMITED");
    break;
  case ResultType::LIMITED:
    res.set("type", "LIMITED");
    break;
  case ResultType::UNFEASIBLE:
    res.set("type", "UNFEASIBLE");
    break;
  }
  return res;
}

EMSCRIPTEN_BINDINGS(simplex)
{
  emscripten::function("simplex", &simplex);

  value_object<Fraction>("Fraction")
      .field("numerator", &Fraction::getNumerator, &Fraction::setNumerator)
      .field("denominator", &Fraction::getDenominator, &Fraction::setDenominator);
}
