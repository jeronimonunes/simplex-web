#include <emscripten/bind.h>
#include "./simplex/src/Simplex.hh"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(simplex)
{
    value_object<Fraction>("Fraction")
        .field("numerator", &Fraction::getNumerator, &Fraction::setNumerator)
        .field("denominator", &Fraction::getDenominator, &Fraction::setDenominator);

    register_vector<Fraction>("vector<Fraction>");
    class_<Vector, base<std::vector<Fraction>>>("Vector")
        .constructor<>()
        .constructor<int>()
        .constructor<Fraction, int>();

    register_vector<Vector>("vector<Vector>");
    class_<Matrix, base<std::vector<Vector>>>("Matrix")
        .constructor<>();

    class_<Tabloid>("Tabloid")
        .constructor<Matrix, Vector, Vector>();

    class_<Result>("Result")
        .property("certificate", &Result::certificate)
        .property("solution", &Result::solution)
        .property("type", &Result::type)
        .property("value", &Result::value);
    
    enum_<ResultType>("ResultType")
        .value("ILIMITED", ResultType::ILIMITED)
        .value("LIMITED", ResultType::LIMITED)
        .value("UNFEASIBLE", ResultType::UNFEASIBLE);

    emscripten::function("runSimplex", &runSimplex);
}