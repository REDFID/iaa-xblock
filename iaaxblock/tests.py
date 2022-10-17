"""
Module To Test VoF XBlock
"""
import json
import unittest

from mock import MagicMock, Mock

from opaque_keys.edx.locations import SlashSeparatedCourseKey

from xblock.field_data import DictFieldData

from .iaaxblock import IterativeAssessedActivityXBlock

class TestRequest(object):
    # pylint: disable=too-few-public-methods
    """
    Module helper for @json_handler
    """
    method = None
    body = None
    success = None

class IAATestCase(unittest.TestCase):
    # pylint: disable=too-many-instance-attributes, too-many-public-methods
    """
    A complete suite of unit tests for the VoF XBlock
    """

    @classmethod
    def make_an_xblock(cls, **kw):
        """
        Helper method that creates a VoF XBlock
        """
        course_id = SlashSeparatedCourseKey('foo', 'bar', 'baz')
        runtime = Mock(
            course_id=course_id,
            service=Mock(
                return_value=Mock(_catalog={}),
            ),
        )
        scope_ids = Mock()
        field_data = DictFieldData(kw)
        xblock = IterativeAssessedActivityXBlock(runtime, field_data, scope_ids)
        xblock.xmodule_runtime = runtime
        return xblock
        

    def setUp(self):
        """
        Creates an xblock
        """
        self.xblock = IAATestCase.make_an_xblock()


    def test_validate_field_data(self):
        """
        Reviso si se creo bien el xblock por defecto, sin intentos y sin respuestas.
        """
        self.assertEqual(self.xblock.title, "Iterative Assessed Activity")
        self.assertEqual(self.xblock.activity_name, "")
        self.assertEqual(self.xblock.block_type, "none")
        self.assertEqual(self.xblock.activity_stage, 0)
        self.assertEqual(self.xblock.stage_label, "")
        self.assertEqual(self.xblock.activity_previous, False)
        self.assertEqual(self.xblock.activity_name_previous, "")
        self.assertEqual(self.xblock.activity_stage_previous, 0)
        self.assertEqual(self.xblock.display_title, "")
        self.assertEqual(self.xblock.question, "")
        self.assertEqual(self.xblock.submission, "")
        self.assertEqual(self.xblock.submission_time, "")
        self.assertEqual(self.xblock.summary_text, "")


    def test_basic_answer(self):
        #pruebo respuestas buenas y malas con el problema default
        request = TestRequest()
        request.method = 'POST'

        data = json.dumps({'respuestas': [{'name': '1', 'value': 'verdadero'}]})
        request.body = data.encode('utf-8')
        response = self.xblock.responder(request)
        self.assertEqual(response.json_body['indicator_class'], 'incorrect')
        self.assertEqual(response.json_body['intentos'], 1)

        data = json.dumps({'respuestas': [{'name': '1', 'value': 'falso'}, {'name': '2', 'value': 'falso'}]})
        request.body = data.encode('utf-8')
        response = self.xblock.responder(request)
        self.assertEqual(response.json_body['indicator_class'], 'incorrect')
        self.assertEqual(response.json_body['intentos'], 2)

    def test_basic_answer2(self):
        #pruebo respuestas buenas y malas con el problema default
        request = TestRequest()
        request.method = 'POST'

        data = json.dumps({'respuestas': [{'name': '1', 'value': 'falso'}, {'name': '2', 'value': 'verdadero'}]})
        request.body = data.encode('utf-8')
        response = self.xblock.responder(request)
        self.assertEqual(response.json_body['indicator_class'], 'incorrect')
        self.assertEqual(response.json_body['intentos'], 1)

        data = json.dumps({'respuestas': [{'name': '1', 'value': 'verdadero'}, {'name': '2', 'value': 'falso'}]})
        request.body = data.encode('utf-8')
        response = self.xblock.responder(request)
        self.assertEqual(response.json_body['indicator_class'], 'correct')
        self.assertEqual(response.json_body['intentos'], 2)

    def test_add_questions(self):
        #pruebo agregar preguntas
        request = TestRequest()
        request.method = 'POST'

        data = json.dumps({'preguntas': [
                                        {'id': '1', 'enunciado':'pregunta verdadera', 'valor': 'V'},
                                        {'id': '2', 'enunciado':'pregunta verdadera 2', 'valor': 'V'},
                                        {'id': '3', 'enunciado':'pregunta falsa', 'valor': 'F'}
                                        ]})
        request.body = data.encode('utf-8')
        response = self.xblock.studio_submit(request)
        self.assertEqual(response.json_body['result'], 'success')
        preguntas = {'1': {'valor': True, 'enunciado': 'pregunta verdadera'}, '2': {'valor': True, 'enunciado': 'pregunta verdadera 2'}, '3': {'valor': False, 'enunciado': 'pregunta falsa'}}
        self.assertEqual(self.xblock.preguntas, preguntas)

    def test_answers_with_more_questions(self):
        #agrego preguntas
        request = TestRequest()
        request.method = 'POST'

        data = json.dumps({'preguntas': [
                                        {'id': '1', 'enunciado':'pregunta verdadera', 'valor': 'V'},
                                        {'id': '2', 'enunciado':'pregunta verdadera 2', 'valor': 'V'},
                                        {'id': '3', 'enunciado':'pregunta falsa', 'valor': 'F'}
                                        ],
                            'nro_de_intentos':4})
        request.body = data.encode('utf-8')
        response = self.xblock.studio_submit(request)

        #pruebo respuestas buenas y malas con el problema con nuevas preguntas
        request = TestRequest()
        request.method = 'POST'

        data = json.dumps({'respuestas': [{'name': '1', 'value': 'verdadero'}]})
        request.body = data.encode('utf-8')
        response = self.xblock.responder(request)
        self.assertEqual(response.json_body['indicator_class'], 'incorrect')
        self.assertEqual(response.json_body['intentos'], 1)

        data = json.dumps({'respuestas': [{'name': '1', 'value': 'falso'}, {'name': '2', 'value': 'falso'}]})
        request.body = data.encode('utf-8')
        response = self.xblock.responder(request)
        self.assertEqual(response.json_body['indicator_class'], 'incorrect')
        self.assertEqual(response.json_body['intentos'], 2)

        data = json.dumps({'respuestas': [{'name': '1', 'value': 'falso'}, {'name': '2', 'value': 'verdadero'}, {'name': '3', 'value': 'verdadero'}]})
        request.body = data.encode('utf-8')
        response = self.xblock.responder(request)
        self.assertEqual(response.json_body['indicator_class'], 'incorrect')
        self.assertEqual(response.json_body['intentos'], 3)

        data = json.dumps({'respuestas': [{'name': '1', 'value': 'verdadero'}, {'name': '2', 'value': 'verdadero'}, {'name': '3', 'value': 'falso'}]})
        request.body = data.encode('utf-8')
        response = self.xblock.responder(request)
        self.assertEqual(response.json_body['indicator_class'], 'correct')
        self.assertEqual(response.json_body['intentos'], 4)